CREATE DATABASE IF NOT EXISTS studentcontrol
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studentcontrol;

DROP TABLE IF EXISTS justificacoes;
DROP TABLE IF EXISTS notificacoes;
DROP TABLE IF EXISTS ppf;
DROP TABLE IF EXISTS presencas;
DROP TABLE IF EXISTS aulas;
DROP TABLE IF EXISTS professor_disciplina_turma;
DROP TABLE IF EXISTS aluno_encarregado;
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS encarregados;
DROP TABLE IF EXISTS professores;
DROP TABLE IF EXISTS disciplinas;
DROP TABLE IF EXISTS turmas;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  perfil ENUM('SECRETARIA', 'PROFESSOR', 'ENCARREGADO') NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  ano_lectivo VARCHAR(20) NOT NULL,
  classe VARCHAR(40) NOT NULL,
  turno ENUM('Manha', 'Tarde', 'Noite') NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disciplinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  limite_ppf INT NOT NULL DEFAULT 6,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE professores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  nome VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  telefone VARCHAR(40),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_professores_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE encarregados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNIQUE,
  nome VARCHAR(160) NOT NULL,
  telefone VARCHAR(40) NOT NULL,
  email VARCHAR(160) UNIQUE,
  parentesco VARCHAR(60),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_encarregados_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  numero_aluno VARCHAR(60) NOT NULL UNIQUE,
  data_nascimento DATE,
  turma_id INT,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alunos_turma FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

CREATE TABLE aluno_encarregado (
  aluno_id INT NOT NULL,
  encarregado_id INT NOT NULL,
  PRIMARY KEY (aluno_id, encarregado_id),
  CONSTRAINT fk_ae_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  CONSTRAINT fk_ae_encarregado FOREIGN KEY (encarregado_id) REFERENCES encarregados(id) ON DELETE CASCADE
);

CREATE TABLE professor_disciplina_turma (
  id INT AUTO_INCREMENT PRIMARY KEY,
  professor_id INT NOT NULL,
  disciplina_id INT NOT NULL,
  turma_id INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pdt (professor_id, disciplina_id, turma_id),
  CONSTRAINT fk_pdt_professor FOREIGN KEY (professor_id) REFERENCES professores(id),
  CONSTRAINT fk_pdt_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  CONSTRAINT fk_pdt_turma FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

CREATE TABLE aulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  professor_id INT NOT NULL,
  disciplina_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  estado ENUM('ABERTA', 'ENCERRADA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_aulas_professor FOREIGN KEY (professor_id) REFERENCES professores(id),
  CONSTRAINT fk_aulas_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  CONSTRAINT fk_aulas_turma FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

CREATE TABLE presencas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aula_id INT NOT NULL,
  aluno_id INT NOT NULL,
  estado ENUM('PRESENTE', 'FALTA') NOT NULL,
  justificada TINYINT(1) NOT NULL DEFAULT 0,
  marcada_por INT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_presenca_aula_aluno (aula_id, aluno_id),
  CONSTRAINT fk_presencas_aula FOREIGN KEY (aula_id) REFERENCES aulas(id),
  CONSTRAINT fk_presencas_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT fk_presencas_usuario FOREIGN KEY (marcada_por) REFERENCES usuarios(id)
);

CREATE TABLE justificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  presenca_id INT NOT NULL,
  justificado_por INT NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  observacao TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_justificacoes_presenca FOREIGN KEY (presenca_id) REFERENCES presencas(id),
  CONSTRAINT fk_justificacoes_usuario FOREIGN KEY (justificado_por) REFERENCES usuarios(id)
);

CREATE TABLE notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encarregado_id INT,
  tipo ENUM('FALTA', 'PPF') NOT NULL,
  destinatario VARCHAR(60) NOT NULL,
  mensagem TEXT NOT NULL,
  estado ENUM('PENDENTE', 'ENVIADO', 'FALHOU') NOT NULL DEFAULT 'PENDENTE',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notificacoes_encarregado FOREIGN KEY (encarregado_id) REFERENCES encarregados(id)
);

CREATE TABLE ppf (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  disciplina_id INT NOT NULL,
  faltas_nao_justificadas INT NOT NULL,
  estado ENUM('ABERTO', 'NOTIFICADO', 'RESOLVIDO') NOT NULL DEFAULT 'ABERTO',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ppf_activa (aluno_id, disciplina_id, estado),
  CONSTRAINT fk_ppf_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT fk_ppf_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);

INSERT INTO usuarios (nome, email, password_hash, perfil) VALUES
('Secretaria Geral', 'secretaria@escola.co.mz', '$2b$10$O5ZmNqxTqxgh0LAmOwD5Z.FaE/4QUxml3sB37YXCfX.3MPCoXJoLG', 'SECRETARIA'),
('Helena Cuinica', 'helena@escola.co.mz', '$2b$10$O5ZmNqxTqxgh0LAmOwD5Z.FaE/4QUxml3sB37YXCfX.3MPCoXJoLG', 'PROFESSOR'),
('Celina Mateus', 'celina@familia.co.mz', '$2b$10$O5ZmNqxTqxgh0LAmOwD5Z.FaE/4QUxml3sB37YXCfX.3MPCoXJoLG', 'ENCARREGADO');

INSERT INTO turmas (nome, ano_lectivo, classe, turno) VALUES
('10 A', '2026', '10 Classe', 'Manha'),
('11 B', '2026', '11 Classe', 'Tarde');

INSERT INTO disciplinas (nome, limite_ppf) VALUES
('Matematica', 3),
('Portugues', 6),
('Fisica', 6);

INSERT INTO professores (usuario_id, nome, email, telefone) VALUES
(2, 'Helena Cuinica', 'helena@escola.co.mz', '+258 84 000 1001');

INSERT INTO encarregados (usuario_id, nome, telefone, email, parentesco) VALUES
(3, 'Celina Mateus', '+258876386514', 'celina@familia.co.mz', 'Mae');

INSERT INTO alunos (nome, numero_aluno, data_nascimento, turma_id) VALUES
('Amilcar Mateus', 'A-001', '2010-03-12', 1),
('Beatriz Nhampossa', 'A-002', '2010-06-22', 1),
('Carlos Mondlane', 'A-003', '2009-11-03', 2);

INSERT INTO aluno_encarregado (aluno_id, encarregado_id) VALUES
(1, 1);

INSERT INTO professor_disciplina_turma (professor_id, disciplina_id, turma_id) VALUES
(1, 1, 1);

INSERT INTO aulas (professor_id, disciplina_id, turma_id, data_aula, hora_inicio, hora_fim, estado) VALUES
(1, 1, 1, CURDATE(), '07:30:00', '08:15:00', 'ABERTA');
