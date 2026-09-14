import { notifyStudentGuardians } from './smsService.js';

export async function verifyPpf(connection, alunoId, disciplinaId) {
  const [[countRow]] = await connection.execute(
    `SELECT COUNT(*) AS total
     FROM presencas p
     JOIN aulas a ON a.id = p.aula_id
     WHERE p.aluno_id = ? AND a.disciplina_id = ? AND p.estado = 'FALTA' AND p.justificada = 0`,
    [alunoId, disciplinaId]
  );

  const [[discipline]] = await connection.execute('SELECT nome, limite_ppf FROM disciplinas WHERE id = ?', [disciplinaId]);
  if (!discipline || countRow.total < discipline.limite_ppf) return;

  const [[existing]] = await connection.execute(
    `SELECT id FROM ppf
     WHERE aluno_id = ? AND disciplina_id = ? AND estado IN ('ABERTO', 'NOTIFICADO')
     LIMIT 1`,
    [alunoId, disciplinaId]
  );

  if (existing) return;

  await connection.execute(
    `INSERT INTO ppf (aluno_id, disciplina_id, faltas_nao_justificadas, estado)
     VALUES (?, ?, ?, 'ABERTO')`,
    [alunoId, disciplinaId, countRow.total]
  );

  await notifyStudentGuardians(
    connection,
    alunoId,
    'PPF',
    {
      disciplina: discipline.nome,
      faltas: countRow.total,
      data: new Date().toISOString().slice(0, 10)
    }
  );
}
