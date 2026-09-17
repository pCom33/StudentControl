import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, query } from './config/db.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { requireRole } from './middleware/roleMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { getSmsConfig, notifyStudentGuardians, sendTestSms, updateSmsTemplates } from './services/smsService.js';
import { verifyPpf } from './services/ppfService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env'), quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

const secretaria = requireRole('SECRETARIA');
const professor = requireRole('PROFESSOR');
const secretariaOrProfessor = requireRole('SECRETARIA', 'PROFESSOR');

function required(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length) {
    const error = new Error('Verifique os campos obrigatorios.');
    error.status = 400;
    throw error;
  }
}

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function validateName(body, field = 'nome') {
  body[field] = cleanText(body[field]);
  if (body[field].length < 2 || body[field].length > 160) badRequest('Informe um nome valido.');
}

function validateEmail(body, field = 'email', optional = false) {
  body[field] = cleanText(body[field])?.toLowerCase();
  if (optional && !body[field]) return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body[field] || '') || body[field].length > 160) {
    badRequest('Informe um email valido.');
  }
}

function normalizeMozambiquePhone(value, optional = false) {
  const digits = String(value || '').replace(/\D/g, '');
  if (optional && !digits) return null;
  const local = digits.startsWith('258') ? digits.slice(3) : digits;
  if (!/^8[2-7]\d{7}$/.test(local)) badRequest('Informe um telefone mocambicano valido (ex.: +258876386514).');
  return `+258${local}`;
}

function validatePositiveInteger(value, label, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > max) badRequest(`${label} invalido.`);
  return number;
}

function validateDate(value, label = 'Data') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '') || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) badRequest(`${label} invalida.`);
}

function normalizeActive(value) {
  if (value === 'Inactivo' || value === '0' || value === 0 || value === false) return 0;
  return 1;
}

function mapDbError(error) {
  if (error?.code === 'ER_DUP_ENTRY') {
    const mapped = new Error('Este registo ja existe.');
    mapped.status = 409;
    return mapped;
  }
  return error;
}

function signUser(user) {
  return jwt.sign(
    { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function findProfessorByUser(userId) {
  const rows = await query('SELECT id FROM professores WHERE usuario_id = :userId LIMIT 1', { userId });
  return rows[0]?.id;
}

function byId(table) {
  return async (req, res, next) => {
    try {
      const rows = await query(`SELECT * FROM ${table} WHERE id = :id LIMIT 1`, { id: req.params.id });
      if (!rows[0]) return res.status(404).json({ message: 'Registo nao encontrado.' });
      return res.json(rows[0]);
    } catch (error) {
      return next(error);
    }
  };
}

function deactivate(table) {
  return async (req, res, next) => {
    try {
      await query(`UPDATE ${table} SET activo = 0 WHERE id = :id`, { id: req.params.id });
      res.json({ message: 'Registo desactivado com sucesso.' });
    } catch (error) {
      next(error);
    }
  };
}

app.get('/api/health', async (req, res, next) => {
  try {
    await query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    required(req.body, ['email', 'password']);
    validateEmail(req.body);
    const emailInput = req.body.email.trim().toLowerCase();
    const rows = await query(
      `SELECT * FROM usuarios 
       WHERE (email = :email 
          OR (email = 'secretaria@escola.co.mz' AND :email = 'secretariageral279@gmail.com')
          OR (email = 'secretariageral279@gmail.com' AND :email = 'secretaria@escola.co.mz'))
         AND activo = 1 
       LIMIT 1`,
      { email: emailInput }
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
      return res.status(401).json({ message: 'Email ou palavra-passe invalida.' });
    }
    res.json({ token: signUser(user), user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil } });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => res.json({ user: req.user }));

app.get('/api/professores', authMiddleware, async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query(
      `SELECT id, usuario_id, nome, email, telefone, IF(activo = 1, 'Activo', 'Inactivo') AS estado
       FROM professores
       WHERE nome LIKE :search OR email LIKE :search
       ORDER BY id DESC`,
      { search }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/professores/:id', authMiddleware, byId('professores'));

app.post('/api/professores', authMiddleware, secretaria, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    required(req.body, ['nome', 'email']);
    validateName(req.body);
    validateEmail(req.body);
    if ((req.body.password || '123456').length < 6) badRequest('A palavra-passe deve ter pelo menos 6 caracteres.');
    req.body.telefone = normalizeMozambiquePhone(req.body.telefone, true);
    await connection.beginTransaction();
    const hash = await bcrypt.hash(req.body.password || '123456', 10);
    const [user] = await connection.execute(
      `INSERT INTO usuarios (nome, email, password_hash, perfil, activo)
       VALUES (?, ?, ?, 'PROFESSOR', ?)`,
      [req.body.nome, req.body.email, hash, normalizeActive(req.body.activo)]
    );
    const [professorRow] = await connection.execute(
      `INSERT INTO professores (usuario_id, nome, email, telefone, activo)
       VALUES (?, ?, ?, ?, ?)`,
      [user.insertId, req.body.nome, req.body.email, req.body.telefone || null, normalizeActive(req.body.activo)]
    );
    await connection.commit();
    res.status(201).json({ id: professorRow.insertId, message: 'Professor registado com sucesso.' });
  } catch (error) {
    await connection.rollback();
    next(mapDbError(error));
  } finally {
    connection.release();
  }
});

app.put('/api/professores/:id', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome', 'email']);
    validateName(req.body);
    validateEmail(req.body);
    req.body.telefone = normalizeMozambiquePhone(req.body.telefone, true);
    await query(
      `UPDATE professores SET nome = :nome, email = :email, telefone = :telefone, activo = :activo WHERE id = :id`,
      { id: req.params.id, nome: req.body.nome, email: req.body.email, telefone: req.body.telefone || null, activo: normalizeActive(req.body.activo) }
    );
    res.json({ message: 'Alteracoes guardadas com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.delete('/api/professores/:id', authMiddleware, secretaria, deactivate('professores'));

app.get('/api/alunos', authMiddleware, async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query(
      `SELECT a.id, a.nome, a.numero_aluno, a.data_nascimento, a.turma_id, t.nome AS turma,
              GROUP_CONCAT(e.nome SEPARATOR ', ') AS encarregado,
              IF(a.activo = 1, 'Activo', 'Inactivo') AS estado
       FROM alunos a
       LEFT JOIN turmas t ON t.id = a.turma_id
       LEFT JOIN aluno_encarregado ae ON ae.aluno_id = a.id
       LEFT JOIN encarregados e ON e.id = ae.encarregado_id
       WHERE a.nome LIKE :search OR a.numero_aluno LIKE :search
       GROUP BY a.id
       ORDER BY a.id DESC`,
      { search }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/alunos/:id', authMiddleware, byId('alunos'));

app.post('/api/alunos', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome', 'numero_aluno']);
    validateName(req.body);
    req.body.numero_aluno = cleanText(req.body.numero_aluno);
    if (req.body.numero_aluno.length > 60) badRequest('O numero de aluno e demasiado longo.');
    if (req.body.data_nascimento) {
      validateDate(req.body.data_nascimento, 'Data de nascimento');
      if (new Date(`${req.body.data_nascimento}T00:00:00Z`) > new Date()) badRequest('A data de nascimento nao pode estar no futuro.');
    }
    if (req.body.turma_id) validatePositiveInteger(req.body.turma_id, 'Turma');
    if (req.body.encarregado_id) validatePositiveInteger(req.body.encarregado_id, 'Encarregado');
    const result = await query(
      `INSERT INTO alunos (nome, numero_aluno, data_nascimento, turma_id, activo)
       VALUES (:nome, :numero_aluno, :data_nascimento, :turma_id, :activo)`,
      {
        nome: req.body.nome,
        numero_aluno: req.body.numero_aluno,
        data_nascimento: req.body.data_nascimento || null,
        turma_id: req.body.turma_id || null,
        activo: normalizeActive(req.body.activo)
      }
    );
    if (req.body.encarregado_id) {
      await query(
        'INSERT IGNORE INTO aluno_encarregado (aluno_id, encarregado_id) VALUES (:alunoId, :encarregadoId)',
        { alunoId: result.insertId, encarregadoId: req.body.encarregado_id }
      );
    }
    res.status(201).json({ id: result.insertId, message: 'Aluno registado com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.put('/api/alunos/:id', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome', 'numero_aluno']);
    validateName(req.body);
    req.body.numero_aluno = cleanText(req.body.numero_aluno);
    if (req.body.numero_aluno.length > 60) badRequest('O numero de aluno e demasiado longo.');
    if (req.body.data_nascimento) validateDate(req.body.data_nascimento, 'Data de nascimento');
    if (req.body.turma_id) validatePositiveInteger(req.body.turma_id, 'Turma');
    await query(
      `UPDATE alunos SET nome = :nome, numero_aluno = :numero_aluno, data_nascimento = :data_nascimento,
       turma_id = :turma_id, activo = :activo WHERE id = :id`,
      {
        id: req.params.id,
        nome: req.body.nome,
        numero_aluno: req.body.numero_aluno,
        data_nascimento: req.body.data_nascimento || null,
        turma_id: req.body.turma_id || null,
        activo: normalizeActive(req.body.activo)
      }
    );
    res.json({ message: 'Alteracoes guardadas com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.delete('/api/alunos/:id', authMiddleware, secretaria, deactivate('alunos'));

app.get('/api/alunos/:id/encarregados', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT e.* FROM encarregados e
       JOIN aluno_encarregado ae ON ae.encarregado_id = e.id
       WHERE ae.aluno_id = :id`,
      { id: req.params.id }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/alunos/:id/presencas', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT p.*, d.nome AS disciplina, a.data_aula
       FROM presencas p
       JOIN aulas a ON a.id = p.aula_id
       JOIN disciplinas d ON d.id = a.disciplina_id
       WHERE p.aluno_id = :id
       ORDER BY a.data_aula DESC`,
      { id: req.params.id }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/alunos/:id/faltas', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT p.id, p.aluno_id, p.estado, p.justificada,
              IF(p.justificada = 1, 'Justificada', 'Nao justificada') AS estado_falta,
              d.nome AS disciplina, a.data_aula
       FROM presencas p
       JOIN aulas a ON a.id = p.aula_id
       JOIN disciplinas d ON d.id = a.disciplina_id
       WHERE p.aluno_id = :id AND p.estado = 'FALTA'
       ORDER BY a.data_aula DESC`,
      { id: req.params.id }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/alunos/:id/ppf', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT ppf.*, d.nome AS disciplina
       FROM ppf
       JOIN disciplinas d ON d.id = ppf.disciplina_id
       WHERE ppf.aluno_id = :id
       ORDER BY ppf.criado_em DESC`,
      { id: req.params.id }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/encarregados', authMiddleware, async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query(
      `SELECT e.id, e.usuario_id, e.nome, e.telefone, e.email, e.parentesco,
              GROUP_CONCAT(a.nome SEPARATOR ', ') AS educando,
              IF(e.activo = 1, 'Activo', 'Inactivo') AS estado
       FROM encarregados e
       LEFT JOIN aluno_encarregado ae ON ae.encarregado_id = e.id
       LEFT JOIN alunos a ON a.id = ae.aluno_id
       WHERE e.nome LIKE :search OR e.telefone LIKE :search OR e.email LIKE :search
       GROUP BY e.id
       ORDER BY e.id DESC`,
      { search }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/encarregados/:id', authMiddleware, byId('encarregados'));

app.post('/api/encarregados', authMiddleware, secretaria, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    required(req.body, ['nome', 'telefone']);
    validateName(req.body);
    req.body.telefone = normalizeMozambiquePhone(req.body.telefone);
    validateEmail(req.body, 'email', true);
    if (req.body.aluno_id) validatePositiveInteger(req.body.aluno_id, 'Aluno');
    await connection.beginTransaction();
    const email = req.body.email || null;
    let userId = null;

    if (email) {
      const hash = await bcrypt.hash(req.body.password || '123456', 10);
      const [user] = await connection.execute(
        `INSERT INTO usuarios (nome, email, password_hash, perfil, activo)
         VALUES (?, ?, ?, 'ENCARREGADO', ?)`,
        [req.body.nome, email, hash, normalizeActive(req.body.activo)]
      );
      userId = user.insertId;
    }

    const [guardian] = await connection.execute(
      `INSERT INTO encarregados (usuario_id, nome, telefone, email, parentesco, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, req.body.nome, req.body.telefone, email, req.body.parentesco || null, normalizeActive(req.body.activo)]
    );

    if (req.body.aluno_id) {
      await connection.execute('INSERT IGNORE INTO aluno_encarregado (aluno_id, encarregado_id) VALUES (?, ?)', [req.body.aluno_id, guardian.insertId]);
    }

    await connection.commit();
    res.status(201).json({ id: guardian.insertId, message: 'Encarregado registado com sucesso.' });
  } catch (error) {
    await connection.rollback();
    next(mapDbError(error));
  } finally {
    connection.release();
  }
});

app.put('/api/encarregados/:id', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome', 'telefone']);
    validateName(req.body);
    req.body.telefone = normalizeMozambiquePhone(req.body.telefone);
    validateEmail(req.body, 'email', true);
    await query(
      `UPDATE encarregados SET nome = :nome, telefone = :telefone, email = :email,
       parentesco = :parentesco, activo = :activo WHERE id = :id`,
      {
        id: req.params.id,
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email || null,
        parentesco: req.body.parentesco || null,
        activo: normalizeActive(req.body.activo)
      }
    );
    res.json({ message: 'Alteracoes guardadas com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.delete('/api/encarregados/:id', authMiddleware, secretaria, deactivate('encarregados'));

app.post('/api/alunos/:id/encarregados', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['encarregado_id']);
    await query('INSERT IGNORE INTO aluno_encarregado (aluno_id, encarregado_id) VALUES (:alunoId, :encarregadoId)', {
      alunoId: req.params.id,
      encarregadoId: req.body.encarregado_id
    });
    res.status(201).json({ message: 'Associacao criada com sucesso.' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/turmas', authMiddleware, async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query(
      `SELECT t.id, t.nome, t.ano_lectivo, t.classe, t.turno, COUNT(a.id) AS numero_alunos,
              IF(t.activo = 1, 'Activo', 'Inactivo') AS estado
       FROM turmas t
       LEFT JOIN alunos a ON a.turma_id = t.id AND a.activo = 1
       WHERE t.nome LIKE :search OR t.ano_lectivo LIKE :search OR t.classe LIKE :search
       GROUP BY t.id
       ORDER BY t.id DESC`,
      { search }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/turmas/:id', authMiddleware, byId('turmas'));

app.post('/api/turmas', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome', 'ano_lectivo', 'classe', 'turno']);
    req.body.nome = cleanText(req.body.nome);
    req.body.classe = cleanText(req.body.classe);
    const year = Number(req.body.ano_lectivo);
    if (!req.body.nome || req.body.nome.length > 80 || !req.body.classe || req.body.classe.length > 40) badRequest('Verifique o nome e a classe da turma.');
    if (!Number.isInteger(year) || year < 2000 || year > 2100) badRequest('Informe um ano lectivo valido.');
    if (!['Manha', 'Tarde', 'Noite'].includes(req.body.turno)) badRequest('Informe um turno valido.');
    const result = await query(
      `INSERT INTO turmas (nome, ano_lectivo, classe, turno, activo)
       VALUES (:nome, :ano_lectivo, :classe, :turno, :activo)`,
      { ...req.body, activo: normalizeActive(req.body.activo) }
    );
    res.status(201).json({ id: result.insertId, message: 'Turma criada com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.put('/api/turmas/:id', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome', 'ano_lectivo', 'classe', 'turno']);
    req.body.nome = cleanText(req.body.nome);
    req.body.classe = cleanText(req.body.classe);
    if (!req.body.nome || req.body.nome.length > 80 || !req.body.classe || req.body.classe.length > 40) badRequest('Verifique o nome e a classe da turma.');
    if (!Number.isInteger(Number(req.body.ano_lectivo)) || Number(req.body.ano_lectivo) < 2000 || Number(req.body.ano_lectivo) > 2100) badRequest('Informe um ano lectivo valido.');
    if (!['Manha', 'Tarde', 'Noite'].includes(req.body.turno)) badRequest('Informe um turno valido.');
    await query(
      `UPDATE turmas SET nome = :nome, ano_lectivo = :ano_lectivo, classe = :classe, turno = :turno, activo = :activo
       WHERE id = :id`,
      { id: req.params.id, ...req.body, activo: normalizeActive(req.body.activo) }
    );
    res.json({ message: 'Alteracoes guardadas com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.get('/api/turmas/:id/alunos', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM alunos WHERE turma_id = :id AND activo = 1 ORDER BY nome', { id: req.params.id });
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/disciplinas', authMiddleware, async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query(
      `SELECT id, nome, limite_ppf, IF(activo = 1, 'Activo', 'Inactivo') AS estado
       FROM disciplinas
       WHERE nome LIKE :search
       ORDER BY id DESC`,
      { search }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/disciplinas', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome']);
    req.body.nome = cleanText(req.body.nome);
    if (!req.body.nome || req.body.nome.length > 120) badRequest('Informe um nome de disciplina valido.');
    req.body.limite_ppf = validatePositiveInteger(req.body.limite_ppf || 6, 'Limite PPF', 100);
    const result = await query(
      'INSERT INTO disciplinas (nome, limite_ppf, activo) VALUES (:nome, :limite_ppf, :activo)',
      { nome: req.body.nome, limite_ppf: req.body.limite_ppf || 6, activo: normalizeActive(req.body.activo) }
    );
    res.status(201).json({ id: result.insertId, message: 'Disciplina criada com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.put('/api/disciplinas/:id', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['nome']);
    req.body.nome = cleanText(req.body.nome);
    if (!req.body.nome || req.body.nome.length > 120) badRequest('Informe um nome de disciplina valido.');
    req.body.limite_ppf = validatePositiveInteger(req.body.limite_ppf || 6, 'Limite PPF', 100);
    await query(
      'UPDATE disciplinas SET nome = :nome, limite_ppf = :limite_ppf, activo = :activo WHERE id = :id',
      { id: req.params.id, nome: req.body.nome, limite_ppf: req.body.limite_ppf || 6, activo: normalizeActive(req.body.activo) }
    );
    res.json({ message: 'Alteracoes guardadas com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.get('/api/associacoes', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT pdt.id, p.nome AS professor, d.nome AS disciplina, t.nome AS turma,
              pdt.professor_id, pdt.disciplina_id, pdt.turma_id
       FROM professor_disciplina_turma pdt
       JOIN professores p ON p.id = pdt.professor_id
       JOIN disciplinas d ON d.id = pdt.disciplina_id
       JOIN turmas t ON t.id = pdt.turma_id
       ORDER BY pdt.id DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/associacoes', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['professor_id', 'disciplina_id', 'turma_id']);
    for (const [field, label] of [['professor_id', 'Professor'], ['disciplina_id', 'Disciplina'], ['turma_id', 'Turma']]) {
      req.body[field] = validatePositiveInteger(req.body[field], label);
    }
    const result = await query(
      `INSERT INTO professor_disciplina_turma (professor_id, disciplina_id, turma_id)
       VALUES (:professor_id, :disciplina_id, :turma_id)`,
      req.body
    );
    res.status(201).json({ id: result.insertId, message: 'Associacao criada com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.get('/api/aulas', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT a.id, a.professor_id, a.disciplina_id, a.turma_id, a.data_aula, a.hora_inicio, a.hora_fim, a.estado,
              p.nome AS professor, d.nome AS disciplina, t.nome AS turma
       FROM aulas a
       JOIN professores p ON p.id = a.professor_id
       JOIN disciplinas d ON d.id = a.disciplina_id
       JOIN turmas t ON t.id = a.turma_id
       ORDER BY a.data_aula DESC, a.hora_inicio DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/aulas/:id', authMiddleware, byId('aulas'));

app.post('/api/aulas', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['professor_id', 'disciplina_id', 'turma_id', 'data_aula', 'hora_inicio', 'hora_fim']);
    for (const [field, label] of [['professor_id', 'Professor'], ['disciplina_id', 'Disciplina'], ['turma_id', 'Turma']]) {
      req.body[field] = validatePositiveInteger(req.body[field], label);
    }
    validateDate(req.body.data_aula, 'Data da aula');
    if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(req.body.hora_inicio) || !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(req.body.hora_fim)) {
      badRequest('Informe horas validas.');
    }
    if (req.body.hora_fim <= req.body.hora_inicio) badRequest('A hora de fim deve ser posterior a hora de inicio.');
    const result = await query(
      `INSERT INTO aulas (professor_id, disciplina_id, turma_id, data_aula, hora_inicio, hora_fim, estado)
       VALUES (:professor_id, :disciplina_id, :turma_id, :data_aula, :hora_inicio, :hora_fim, 'ABERTA')`,
      req.body
    );
    res.status(201).json({ id: result.insertId, message: 'Alteracoes guardadas com sucesso.' });
  } catch (error) {
    next(mapDbError(error));
  }
});

app.get('/api/aulas/professor/:id', authMiddleware, secretariaOrProfessor, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT a.*, d.nome AS disciplina, t.nome AS turma
       FROM aulas a
       JOIN disciplinas d ON d.id = a.disciplina_id
       JOIN turmas t ON t.id = a.turma_id
       WHERE a.professor_id = :id
       ORDER BY a.data_aula DESC, a.hora_inicio DESC`,
      { id: req.params.id }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/aulas/:id/alunos', authMiddleware, secretariaOrProfessor, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT al.id, al.nome, al.numero_aluno
       FROM alunos al
       JOIN aulas au ON au.turma_id = al.turma_id
       WHERE au.id = :id AND al.activo = 1
       ORDER BY al.nome`,
      { id: req.params.id }
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/aulas/:id/chamada', authMiddleware, professor, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    if (!Array.isArray(req.body.presencas) || req.body.presencas.length === 0) {
      return res.status(400).json({ message: 'Informe as presencas dos alunos.' });
    }
    await connection.beginTransaction();
    const [[aula]] = await connection.execute('SELECT * FROM aulas WHERE id = ? FOR UPDATE', [req.params.id]);
    if (!aula) {
      const error = new Error('Aula nao encontrada.');
      error.status = 404;
      throw error;
    }
    if (aula.estado === 'ENCERRADA') {
      const error = new Error('A chamada desta aula ja foi submetida.');
      error.status = 409;
      throw error;
    }

    const professorId = await findProfessorByUser(req.user.id);
    if (Number(aula.professor_id) !== Number(professorId)) {
      const error = new Error('Nao tem permissao para realizar esta operacao.');
      error.status = 403;
      throw error;
    }

    for (const item of req.body.presencas || []) {
      if (!item.aluno_id || !['PRESENTE', 'FALTA'].includes(item.estado)) {
        const error = new Error('Existem dados de presenca invalidos.');
        error.status = 400;
        throw error;
      }
      const [[student]] = await connection.execute(
        'SELECT id FROM alunos WHERE id = ? AND turma_id = ? AND activo = 1',
        [item.aluno_id, aula.turma_id]
      );
      if (!student) {
        const error = new Error('Um dos alunos nao pertence a turma desta aula.');
        error.status = 400;
        throw error;
      }
      await connection.execute('INSERT INTO presencas (aula_id, aluno_id, estado, marcada_por) VALUES (?, ?, ?, ?)', [
        aula.id,
        item.aluno_id,
        item.estado,
        req.user.id
      ]);
      if (item.estado === 'FALTA') {
        const [[discipline]] = await connection.execute('SELECT nome FROM disciplinas WHERE id = ?', [aula.disciplina_id]);
        await notifyStudentGuardians(connection, item.aluno_id, 'FALTA', {
          disciplina: discipline?.nome || 'Disciplina',
          data: String(aula.data_aula || '').slice(0, 10)
        });
        await verifyPpf(connection, item.aluno_id, aula.disciplina_id);
      }
    }

    await connection.execute('UPDATE aulas SET estado = "ENCERRADA" WHERE id = ?', [aula.id]);
    await connection.commit();
    res.status(201).json({ message: 'Chamada submetida com sucesso.' });
  } catch (error) {
    await connection.rollback();
    next(mapDbError(error));
  } finally {
    connection.release();
  }
});

app.get('/api/faltas', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT p.id, al.nome AS aluno, t.nome AS turma, d.nome AS disciplina, a.data_aula,
              IF(p.justificada = 1, 'Justificada', 'Nao justificada') AS estado
       FROM presencas p
       JOIN alunos al ON al.id = p.aluno_id
       JOIN aulas a ON a.id = p.aula_id
       JOIN turmas t ON t.id = a.turma_id
       JOIN disciplinas d ON d.id = a.disciplina_id
       WHERE p.estado = 'FALTA'
       ORDER BY a.data_aula DESC, p.id DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.put('/api/presencas/:id/justificar', authMiddleware, secretaria, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    required(req.body, ['motivo']);
    req.body.motivo = cleanText(req.body.motivo);
    if (req.body.motivo.length < 3 || req.body.motivo.length > 255) badRequest('Informe um motivo valido.');
    await connection.beginTransaction();
    await connection.execute(
      'INSERT INTO justificacoes (presenca_id, justificado_por, motivo, observacao) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, req.body.motivo, req.body.observacao || '']
    );
    await connection.execute('UPDATE presencas SET justificada = 1 WHERE id = ?', [req.params.id]);
    await connection.commit();
    res.json({ message: 'Falta justificada com sucesso.' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.get('/api/notificacoes', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT n.*, e.nome AS encarregado
       FROM notificacoes n
       LEFT JOIN encarregados e ON e.id = n.encarregado_id
       ORDER BY n.criado_em DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/ppf', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT ppf.id, a.nome AS aluno, d.nome AS disciplina, ppf.faltas_nao_justificadas, ppf.estado, ppf.criado_em
       FROM ppf
       JOIN alunos a ON a.id = ppf.aluno_id
       JOIN disciplinas d ON d.id = ppf.disciplina_id
       ORDER BY ppf.criado_em DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/ppf/:id', authMiddleware, byId('ppf'));

app.get('/api/dashboard/secretaria', authMiddleware, secretaria, async (req, res, next) => {
  try {
    const [[alunos]] = await pool.execute('SELECT COUNT(*) AS total FROM alunos WHERE activo = 1');
    const [[professores]] = await pool.execute('SELECT COUNT(*) AS total FROM professores WHERE activo = 1');
    const [[turmas]] = await pool.execute('SELECT COUNT(*) AS total FROM turmas WHERE activo = 1');
    const [[faltasHoje]] = await pool.execute(`SELECT COUNT(*) AS total FROM presencas WHERE estado = 'FALTA' AND DATE(criado_em) = CURDATE()`);
    const [[faltasNaoJustificadas]] = await pool.execute(`SELECT COUNT(*) AS total FROM presencas WHERE estado = 'FALTA' AND justificada = 0`);
    const [[ppf]] = await pool.execute(`SELECT COUNT(*) AS total FROM ppf WHERE estado IN ('ABERTO','NOTIFICADO')`);
    res.json({
      alunos: alunos.total,
      professores: professores.total,
      turmas: turmas.total,
      faltasHoje: faltasHoje.total,
      faltasNaoJustificadas: faltasNaoJustificadas.total,
      ppf: ppf.total
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard/professor', authMiddleware, professor, async (req, res, next) => {
  try {
    const professorId = await findProfessorByUser(req.user.id);
    const rows = await query(
      `SELECT a.*, d.nome AS disciplina, t.nome AS turma
       FROM aulas a
       JOIN disciplinas d ON d.id = a.disciplina_id
       JOIN turmas t ON t.id = a.turma_id
       WHERE a.professor_id = :professorId
       ORDER BY a.data_aula DESC, a.hora_inicio DESC`,
      { professorId }
    );
    res.json({ aulasHoje: rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard/encarregado', authMiddleware, requireRole('ENCARREGADO'), async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT a.id, a.nome,
              SUM(CASE WHEN p.estado = 'PRESENTE' THEN 1 ELSE 0 END) AS presencas,
              SUM(CASE WHEN p.estado = 'FALTA' THEN 1 ELSE 0 END) AS faltas,
              SUM(CASE WHEN p.estado = 'FALTA' AND p.justificada = 0 THEN 1 ELSE 0 END) AS nao_justificadas
       FROM encarregados e
       JOIN aluno_encarregado ae ON ae.encarregado_id = e.id
       JOIN alunos a ON a.id = ae.aluno_id
       LEFT JOIN presencas p ON p.aluno_id = a.id
       WHERE e.usuario_id = :userId
       GROUP BY a.id`,
      { userId: req.user.id }
    );
    res.json({ educandos: rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/config/sms', authMiddleware, secretaria, (req, res) => {
  res.json(getSmsConfig());
});

app.post('/api/config/sms', authMiddleware, secretaria, (req, res) => {
  const updated = updateSmsTemplates(req.body.templates || {});
  res.json({ message: 'Modelos de SMS actualizados com sucesso.', templates: updated });
});

app.post('/api/config/sms/test', authMiddleware, secretaria, async (req, res, next) => {
  try {
    required(req.body, ['destinatario']);
    const result = await sendTestSms({
      destinatario: req.body.destinatario,
      mensagem: req.body.mensagem
    });
    res.json({ message: 'Teste de disparo processado.', result });
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

const port = Number(process.env.PORT || 4000);
app.listen(port, async () => {
  console.log(`StudentControl API activa em http://127.0.0.1:${port}`);
  try {
    await query("UPDATE usuarios SET email = 'secretariageral279@gmail.com' WHERE email = 'secretaria@escola.co.mz' OR id = 1");
    await query("ALTER TABLE justificacoes ADD COLUMN documento_anexo VARCHAR(255) NULL");
    console.log('[DB SYNC] Base de dados sincronizada com sucesso.');
  } catch (_) {}
});
