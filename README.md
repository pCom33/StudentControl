# StudentControl

Sistema web de controlo de presencas e faltas de estudantes com notificacao por SMS aos encarregados de educacao.

## Stack

- Frontend: React + Vite
- Backend/API: Node.js + Express
- Base de dados: MySQL, compativel com XAMPP
- Autenticacao: JWT + bcryptjs
- SMS: simulacao local na Fase 1 (a integracao com um provedor real ainda nao esta implementada)

## Estrutura

```text
frontend/
backend/
database/
docs/
```

## Base de dados no XAMPP

1. Abrir XAMPP e iniciar Apache e MySQL.
2. Abrir `http://localhost/phpmyadmin`.
3. Importar o ficheiro:

```text
database/studentcontrol_xampp.sql
```

O script cria a base `studentcontrol`, as tabelas e dados iniciais.

Conta inicial:

```text
Email: secretaria@escola.co.mz
Palavra-passe: 123456
```

## Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

API local:

```text
http://127.0.0.1:4000/api
```

Teste rapido:

```text
GET http://127.0.0.1:4000/api/health
```

## Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Aplicacao local:

```text
http://127.0.0.1:5173
```

O `frontend/.env` deve conter apenas:

```env
VITE_API_URL=http://127.0.0.1:4000/api
```

Nunca coloque `DB_PASSWORD`, `JWT_SECRET` ou outras credenciais no frontend.

Se a porta `5173` ja estiver ocupada, o Vite pode abrir automaticamente em `5174` ou outra porta livre. Usa sempre o endereco mostrado no terminal.

## Arranque pela raiz

Depois de instalar as dependencias do `backend` e do `frontend`, tambem podes iniciar tudo a partir de `D:\StudentControl`:

```bash
npm start
```

Para iniciar apenas a API a partir da raiz:

```bash
node server.js
```

## Endpoints principais

```text
POST /api/auth/login
GET  /api/auth/me

GET    /api/professores
POST   /api/professores
PUT    /api/professores/:id
DELETE /api/professores/:id

GET    /api/alunos
POST   /api/alunos
PUT    /api/alunos/:id
DELETE /api/alunos/:id
GET    /api/alunos/:id/faltas

GET  /api/encarregados
POST /api/encarregados
POST /api/alunos/:id/encarregados

GET  /api/turmas
POST /api/turmas
GET  /api/turmas/:id/alunos

GET  /api/disciplinas
POST /api/disciplinas

POST /api/associacoes
POST /api/aulas
GET  /api/aulas/professor/:id
POST /api/aulas/:id/chamada

PUT /api/presencas/:id/justificar
GET /api/ppf
GET /api/dashboard/secretaria
GET /api/dashboard/professor
GET /api/dashboard/encarregado
```

## Teste das notificacoes SMS

Com `SMS_MODE=simulation`, uma falta cria uma linha em `notificacoes` com estado
`ENVIADO`, mas nenhuma mensagem sai para a rede. Isso permite testar todo o fluxo
funcional sem custos: professor faz a chamada, o sistema regista a falta e a
secretaria confirma o aviso no ecra **Avisos** ou na tabela `notificacoes`.

O valor `SMS_MODE=production` apenas cria notificacoes com estado `PENDENTE`.
Antes de testar SMS num telefone real e necessario escolher um provedor que envie
para numeros mocambicanos, obter as credenciais e implementar o envio/retorno no
`backend/services/smsService.js`. Nao use `production` como prova de entrega ate
essa integracao existir.

O contacto de teste Movitel configurado nos dados iniciais e `+258876386514`.
O prefixo Movitel do destinatario nao transforma o cartao SIM numa API: para envio
real e necessario contratar o servico Bulk SMS da Movitel (normalmente via SMPP ou
gateway empresarial) ou um gateway HTTP que entregue na rede Movitel.

## Icones

A interface usa icones SVG locais no estilo lineal arredondado, alinhados com a referencia indicada da Magnific: `Basic Rounded Lineal`.

Antes de uma entrega publica com assets baixados directamente da Magnific, confirmar licencas e atribuicao.
