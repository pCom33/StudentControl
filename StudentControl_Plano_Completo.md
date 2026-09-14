# StudentControl

## Documento de Requisitos, Arquitectura, Frameworks e Plano de Desenvolvimento

**Projecto:** StudentControl --- Sistema Web de Controlo de Presenças e
Faltas de Estudantes com Notificação Automática por SMS aos Encarregados
de Educação\
**Área:** Plataformas Electrónicas e Software de Gestão\
**Versão de planeamento:** Fase 1 + preparação da evolução
StudentControl 2.0\
**Stack aprovada:** React + Node.js + Express + MySQL + mysql2 + JWT +
bcryptjs + API de SMS

------------------------------------------------------------------------

## 1. Visão do Projecto

O StudentControl é uma plataforma para digitalizar o controlo de
assiduidade escolar. O núcleo do sistema permite que professores
registem presenças e faltas por aula, que a secretaria faça a gestão
académica e justifique faltas, e que encarregados de educação acompanhem
a assiduidade dos seus educandos e recebam notificações por SMS.

A Fase 1 deverá resultar num sistema realmente funcional, cobrindo
autenticação, perfis, professores, alunos, encarregados, turmas,
disciplinas, associações académicas, aulas, chamada, presenças/faltas,
justificações, notificações SMS e PPF.

A evolução posterior, StudentControl 2.0, acrescentará monitoria
avançada, funcionamento offline, alerta precoce, análise de risco de
abandono, causas do absentismo, intervenções e relatórios analíticos.

------------------------------------------------------------------------

## 2. Objectivo Geral

Desenvolver uma plataforma web funcional que permita controlar a
assiduidade dos estudantes, melhorar a comunicação entre escola e
encarregados de educação e automatizar a identificação de situações de
Punição por Faltas (PPF).

## 3. Objectivos Específicos

1.  Implementar autenticação segura e controlo de acesso por perfil.
2.  Permitir à secretaria gerir alunos, professores, encarregados,
    turmas e disciplinas.
3.  Associar professores às respectivas disciplinas e turmas.
4.  Permitir ao professor efectuar e submeter a chamada por aula.
5.  Registar presenças e faltas na base de dados.
6.  Notificar automaticamente o encarregado quando uma falta for
    confirmada.
7.  Permitir apenas à secretaria justificar faltas.
8.  Contabilizar automaticamente faltas não justificadas por aluno e
    disciplina.
9.  Gerar PPF automaticamente quando o limite definido for ultrapassado.
10. Manter histórico e rastreabilidade das principais operações.
11. Disponibilizar dashboards adequados a cada perfil.

------------------------------------------------------------------------

# 4. Perfis de Utilizador

## 4.1 Secretaria

Responsável pela administração académica do sistema.

Principais permissões:

-   gerir professores;
-   gerir alunos;
-   gerir encarregados;
-   gerir turmas;
-   gerir disciplinas;
-   associar professor + disciplina + turma;
-   consultar faltas;
-   justificar faltas;
-   consultar PPF;
-   consultar notificações;
-   visualizar indicadores gerais.

## 4.2 Professor

Responsável pelo registo da assiduidade.

Principais permissões:

-   iniciar sessão;
-   consultar as suas turmas;
-   consultar as suas aulas;
-   visualizar alunos das turmas atribuídas;
-   efectuar chamada;
-   marcar presença ou falta;
-   submeter chamada;
-   consultar histórico das suas chamadas.

O professor não poderá justificar faltas nem alterar administrativamente
uma falta já consolidada.

## 4.3 Encarregado de Educação

Responsável pelo acompanhamento do educando.

Principais permissões:

-   iniciar sessão;
-   consultar educandos associados;
-   consultar assiduidade;
-   consultar faltas;
-   consultar avisos;
-   receber notificações SMS.

------------------------------------------------------------------------

# 5. Requisitos Funcionais

## RF01 --- Autenticação

O sistema deve permitir login através de email e palavra-passe.

## RF02 --- Perfis e permissões

O sistema deve possuir, no mínimo, os perfis SECRETARIA, PROFESSOR e
ENCARREGADO e restringir as operações de acordo com o perfil
autenticado.

## RF03 --- Gestão de professores

A secretaria deve poder criar, consultar, actualizar e desactivar
professores.

## RF04 --- Gestão de alunos

A secretaria deve poder criar, consultar, actualizar e desactivar
alunos.

## RF05 --- Gestão de encarregados

A secretaria deve poder criar, consultar, actualizar e associar
encarregados aos respectivos educandos.

## RF06 --- Gestão de turmas

A secretaria deve poder criar e gerir turmas por ano lectivo, classe e
turno.

## RF07 --- Gestão de disciplinas

A secretaria deve poder criar e actualizar disciplinas.

## RF08 --- Associação académica

A secretaria deve poder associar um professor a uma disciplina e a uma
turma.

## RF09 --- Gestão de aulas

O sistema deve representar aulas contendo professor, disciplina, turma,
data, hora inicial, hora final e estado.

## RF10 --- Consulta das aulas do professor

O professor deve visualizar apenas aulas/turmas que lhe tenham sido
atribuídas.

## RF11 --- Chamada

O professor deve poder abrir uma aula e visualizar a lista de estudantes
matriculados na turma.

## RF12 --- Marcação de assiduidade

O professor deve poder marcar cada estudante como PRESENTE ou FALTA.

## RF13 --- Confirmação da chamada

A chamada só deve ser consolidada após confirmação explícita do
professor.

## RF14 --- Prevenção de chamada duplicada

Uma aula cuja chamada tenha sido encerrada não deve aceitar uma segunda
submissão normal.

## RF15 --- Registo de falta

Ao confirmar a chamada, as faltas devem ser persistidas na base de
dados.

## RF16 --- Notificação de falta

Depois de uma falta ser confirmada, o sistema deve localizar o(s)
encarregado(s) associado(s) ao estudante e processar uma notificação
SMS.

## RF17 --- Modo de SMS simulado

Durante o desenvolvimento, o sistema deve possuir um modo de simulação
de SMS que permita testar o fluxo sem consumir créditos.

## RF18 --- Modo de SMS real

O sistema deve permitir configurar posteriormente uma API real de SMS
sem alterar a lógica principal da aplicação.

## RF19 --- Histórico de notificações

O sistema deve registar o destinatário, tipo, mensagem, data e estado da
notificação.

## RF20 --- Estados de notificação

Uma notificação deve poder assumir estados como PENDENTE, ENVIADO ou
FALHOU.

## RF21 --- Consulta de faltas

A secretaria deve poder consultar e filtrar faltas por aluno, turma,
disciplina e estado.

## RF22 --- Justificação de falta

Apenas a secretaria deve poder justificar uma falta.

## RF23 --- Auditoria da justificação

O sistema deve guardar quem justificou, quando justificou, o motivo e
uma observação opcional.

## RF24 --- Preservação do histórico

Uma falta justificada não deve ser apagada. O seu estado deve ser
actualizado mantendo o histórico.

## RF25 --- Contagem automática

O sistema deve contar faltas não justificadas por estudante e por
disciplina.

## RF26 --- PPF

Quando o número de faltas não justificadas ultrapassar o limite
definido, o sistema deve gerar um registo de PPF.

## RF27 --- Prevenção de PPF duplicada

O sistema não deve criar repetidamente a mesma PPF para o mesmo
estudante e disciplina.

## RF28 --- SMS de PPF

Quando uma nova PPF for gerada, o sistema deve processar uma notificação
específica ao encarregado.

## RF29 --- Dashboard da secretaria

O sistema deve disponibilizar indicadores como total de alunos,
professores, turmas, faltas e PPF.

## RF30 --- Dashboard do professor

O sistema deve apresentar as turmas, aulas e actividades relevantes ao
professor autenticado.

## RF31 --- Dashboard do encarregado

O sistema deve permitir seleccionar um educando e consultar os seus
principais indicadores de assiduidade.

## RF32 --- Pesquisa e filtros

As principais listas administrativas devem permitir pesquisa e filtros
adequados.

## RF33 --- Estados de registos

O sistema deve permitir distinguir registos activos e inactivos quando
aplicável.

## RF34 --- Logout

O utilizador autenticado deve poder terminar a sessão.

------------------------------------------------------------------------

# 6. Requisitos Não Funcionais

## RNF01 --- Segurança

As palavras-passe devem ser armazenadas através de hash seguro, nunca em
texto simples.

## RNF02 --- Autorização no backend

As permissões devem ser verificadas no servidor. Esconder um botão no
frontend não será considerado mecanismo de segurança.

## RNF03 --- JWT

A autenticação da API utilizará tokens JWT com expiração.

## RNF04 --- Protecção de segredos

Credenciais de MySQL, JWT e API de SMS devem ficar em variáveis de
ambiente (`.env`) e não no código-fonte público.

## RNF05 --- Integridade

O sistema deve utilizar relações e restrições da base de dados para
reduzir registos inconsistentes.

## RNF06 --- SQL Injection

As consultas devem utilizar parâmetros/prepared statements através do
`mysql2`.

## RNF07 --- Validação

Os dados recebidos pela API devem ser validados antes de serem gravados.

## RNF08 --- Usabilidade

A interface deve ser simples, consistente e adequada a utilizadores com
diferentes níveis de experiência tecnológica.

## RNF09 --- Responsividade

A aplicação web deverá adaptar-se, pelo menos, a computadores e tablets;
a adaptação móvel completa poderá ser refinada posteriormente.

## RNF10 --- Desempenho

As operações comuns devem responder sem atrasos perceptíveis numa
utilização escolar normal.

## RNF11 --- Manutenibilidade

O backend deverá separar rotas, controllers, middleware, serviços,
configuração e utilitários.

## RNF12 --- Escalabilidade

A arquitectura deverá permitir acrescentar módulos do StudentControl 2.0
sem reconstruir o núcleo da aplicação.

## RNF13 --- Auditoria

Operações sensíveis, especialmente justificações e PPF, devem possuir
informação suficiente para rastrear a alteração.

## RNF14 --- Disponibilidade de SMS

Falha no serviço de SMS não deve apagar nem impedir o registo correcto
da falta. A notificação deve ficar registada como falhada/pendente
conforme a implementação.

## RNF15 --- Privacidade

Dados de estudantes e encarregados devem ser acessíveis apenas aos
perfis autorizados.

## RNF16 --- Consistência visual

Todos os módulos devem seguir o mesmo sistema de navegação, componentes,
espaçamentos e estados visuais.

## RNF17 --- Compatibilidade

A aplicação deverá funcionar nos navegadores modernos utilizados durante
o desenvolvimento e apresentação.

## RNF18 --- Recuperação

A base de dados deverá permitir a implementação de backups antes de
utilização real.

------------------------------------------------------------------------

# 7. Stack Tecnológica Aprovada

  Camada                         Tecnologia
  ------------------------------ -----------------------------------------
  Frontend                       React
  Ferramenta frontend            Vite
  Backend                        Node.js
  Framework backend              Express
  Base de dados                  MySQL
  Driver MySQL                   mysql2
  Autenticação                   JWT
  Hash de passwords              bcryptjs
  Configuração                   dotenv
  Comunicação frontend/backend   API REST + JSON
  CORS                           cors
  SMS                            Serviço/API de SMS integrado no backend
  Testes de API                  Postman
  Controlo de versões            Git

------------------------------------------------------------------------

# 8. Arquitectura Geral

``` text
UTILIZADOR
    |
    v
FRONTEND — React
    |
    | HTTP/JSON
    v
BACKEND — Node.js + Express
    |
    +--------------------+
    |                    |
    v                    v
MySQL               Serviço de SMS
    |                    |
    v                    v
Dados               Telemóvel do
académicos          encarregado
```

Fluxo de uma falta:

``` text
Professor
   |
   v
Fazer chamada
   |
   v
Confirmar chamada
   |
   v
API REST
   |
   v
Guardar presença/falta no MySQL
   |
   +--------------------+
   |                    |
   v                    v
Contar faltas       Processar SMS
   |                    |
   v                    v
Verificar PPF       Encarregado
```

------------------------------------------------------------------------

# 9. Modelo de Dados Inicial

Tabelas previstas:

``` text
usuarios
professores
encarregados
turmas
disciplinas
alunos
aluno_encarregado
professor_disciplina_turma
aulas
presencas
justificacoes
notificacoes
ppf
```

Relações conceptuais:

``` text
USUARIO
├── SECRETARIA
├── PROFESSOR
└── ENCARREGADO

TURMA
└── ALUNOS

PROFESSOR
└── DISCIPLINA
    └── TURMA

ALUNO
├── ENCARREGADO(S)
├── PRESENÇAS/FALTAS
├── JUSTIFICAÇÕES
└── PPF

AULA
├── PROFESSOR
├── DISCIPLINA
├── TURMA
└── PRESENÇAS
```

------------------------------------------------------------------------

# 10. Framework Low-Fi --- Sem Copy e Sem Design

O Low-Fi define somente estrutura, posição e navegação.

## 10.1 Login

``` text
+--------------------------------------+
|                                      |
|                                      |
|          [_______________]           |
|                                      |
|          [_______________]           |
|                                      |
|             [_______]                |
|                                      |
+--------------------------------------+
```

## 10.2 Estrutura principal

``` text
+------------------------------------------------------+
|                        TOPO                          |
+-------------+----------------------------------------+
|             |                                        |
|   MENU      |               CONTEÚDO                 |
|             |                                        |
|             |                                        |
+-------------+----------------------------------------+
```

## 10.3 Dashboard

``` text
+------------------------------------------------------+
| TOPO                                                 |
+-------------+----------------------------------------+
| MENU        | +---------+ +---------+ +---------+    |
|             | |         | |         | |         |    |
|             | +---------+ +---------+ +---------+    |
|             |                                        |
|             | +----------------------------------+   |
|             | |                                  |   |
|             | +----------------------------------+   |
+-------------+----------------------------------------+
```

## 10.4 Lista administrativa

Aplicável a alunos, professores, encarregados e disciplinas.

``` text
+------------------------------------------------------+
| TOPO                                                 |
+-------------+----------------------------------------+
| MENU        | [_______________]       [ + ]          |
|             |                                        |
|             | +----------------------------------+   |
|             | |                                  |   |
|             | |             TABELA               |   |
|             | |                                  |   |
|             | +----------------------------------+   |
+-------------+----------------------------------------+
```

## 10.5 Formulário

``` text
+------------------------------------------+
|                                          |
| [________________] [________________]     |
|                                          |
| [________________] [___________▼____]     |
|                                          |
| [________]                 [________]     |
+------------------------------------------+
```

## 10.6 Detalhes de turma/perfil

``` text
+------------------------------------------------------+
| TOPO                                                 |
+-------------+----------------------------------------+
| MENU        | [ INFORMAÇÃO PRINCIPAL ]               |
|             |                                        |
|             | [ TAB ] [ TAB ] [ TAB ]                |
|             |                                        |
|             | +----------------------------------+   |
|             | |                                  |   |
|             | +----------------------------------+   |
+-------------+----------------------------------------+
```

## 10.7 Fazer chamada

``` text
+------------------------------------------------------+
|                                                      |
| +--------------------------------------------------+ |
| |                                                  | |
| +--------------------------------------------------+ |
|                                                      |
| ITEM 1                    ( )              ( )        |
| ITEM 2                    ( )              ( )        |
| ITEM 3                    ( )              ( )        |
| ITEM 4                    ( )              ( )        |
|                                                      |
|                                  [___________]        |
+------------------------------------------------------+
```

## 10.8 Confirmação

``` text
+--------------------------------------+
|                                      |
|                                      |
|          RESUMO/INFORMAÇÃO           |
|                                      |
|                                      |
| [________]             [________]     |
+--------------------------------------+
```

## 10.9 Faltas e PPF

``` text
+------------------------------------------------------+
|                                                      |
| [________] [________] [________]                     |
|                                                      |
| +--------------------------------------------------+ |
| |                                                  | |
| |                    TABELA                        | |
| |                                                  | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
```

------------------------------------------------------------------------

# 11. Framework com Copy --- Sem Design

## 11.1 Login

``` text
STUDENTCONTROL

Iniciar sessão

Email
[____________________________]

Palavra-passe
[____________________________]

[ ] Mostrar palavra-passe

[ ENTRAR ]

Esqueceu a palavra-passe?
```

## 11.2 Menu da Secretaria

``` text
Dashboard
Alunos
Encarregados
Professores
Turmas
Disciplinas
Associações
Faltas
PPF
Minha Conta
Sair
```

## 11.3 Dashboard da Secretaria

``` text
Dashboard
Visão geral da instituição

Alunos
Professores
Turmas
Faltas hoje
Faltas não justificadas
Alunos com PPF

Actividade recente
```

## 11.4 Alunos

``` text
Alunos
Consulte e faça a gestão dos alunos registados no sistema.

Pesquisar por nome ou número...
Turma: Todas
Estado: Todos
+ Novo aluno

Nº | Nome | Turma | Estado | Acções
```

## 11.5 Novo aluno

``` text
Novo aluno
Registe os dados do aluno.

Nome completo *
Número do aluno *
Sexo
Data de nascimento
Turma *
Estado

CANCELAR
GUARDAR ALUNO
```

## 11.6 Professores

``` text
Professores
Faça a gestão dos professores registados no sistema.

Pesquisar professor...
+ Novo professor

Nome | Email | Estado | Acções
```

## 11.7 Novo professor

``` text
Novo professor

Nome completo *
Email *
Telefone
Palavra-passe inicial *
Estado

CANCELAR
GUARDAR PROFESSOR
```

## 11.8 Encarregados

``` text
Encarregados de Educação
Faça a gestão dos encarregados associados aos alunos.

Pesquisar...
+ Novo encarregado

Nome | Telefone | Educando | Acções
```

## 11.9 Novo encarregado

``` text
Novo encarregado

Nome completo *
Telefone para notificações *
Email
Parentesco
Educando

CANCELAR
GUARDAR ENCARREGADO
```

## 11.10 Turmas

``` text
Turmas
Organize os alunos e disciplinas por turma.

Ano lectivo
+ Nova turma

Nome da turma
Número de alunos
Turno
ABRIR TURMA
```

## 11.11 Associação académica

``` text
Associação Académica
Associe professores às disciplinas e turmas que leccionam.

Professor *
Disciplina *
Turma *

CRIAR ASSOCIAÇÃO

Associações existentes
Professor | Disciplina | Turma | Acção
```

## 11.12 Professor --- Dashboard

``` text
Bom dia, [Professor]

Aqui estão as suas actividades de hoje.

Minhas turmas
Aulas hoje

Aulas de hoje

FAZER CHAMADA
```

## 11.13 Fazer chamada

``` text
Fazer chamada

Disciplina
Turma
Data
Professor

Alunos

Nº | Aluno | Presente | Falta

Presentes:
Faltas:

SUBMETER CHAMADA
```

## 11.14 Confirmação da chamada

``` text
Confirmar chamada

Está prestes a submeter a chamada desta aula.

Presentes:
Faltas:

Após a confirmação, as faltas serão registadas e as notificações serão processadas.

VOLTAR
CONFIRMAR
```

## 11.15 Faltas

``` text
Faltas
Consulte e faça o acompanhamento das faltas registadas.

Aluno
Turma
Disciplina
Estado

FILTRAR
LIMPAR FILTROS

Aluno | Disciplina | Data | Estado | Acção
```

## 11.16 Justificação

``` text
Justificar falta

Aluno
Disciplina
Data

Motivo *
Observação

CANCELAR
JUSTIFICAR
```

## 11.17 PPF

``` text
Punição por Faltas — PPF

Acompanhe os alunos que ultrapassaram o limite de faltas não justificadas por disciplina.

Pesquisar aluno...

Aluno | Disciplina | Faltas | Estado | Acção
```

## 11.18 Encarregado

``` text
Dashboard
Meus Educandos
Assiduidade
Avisos
Minha Conta
Sair
```

## 11.19 Dashboard do encarregado

``` text
Olá, [Encarregado]

Acompanhe a assiduidade do seu educando.

Educando

Presenças
Faltas
Não justificadas

Actividade recente
```

------------------------------------------------------------------------

# 12. Mensagens do Sistema

## Sucesso

``` text
Aluno registado com sucesso.
Professor registado com sucesso.
Encarregado registado com sucesso.
Turma criada com sucesso.
Disciplina criada com sucesso.
Associação criada com sucesso.
Chamada submetida com sucesso.
Falta justificada com sucesso.
Alterações guardadas com sucesso.
```

## Erro

``` text
Não foi possível concluir a operação. Tente novamente.
Verifique os campos obrigatórios.
Este email já está registado.
Este número de aluno já está registado.
Este professor já está associado a esta disciplina e turma.
Não tem permissão para realizar esta operação.
A chamada desta aula já foi submetida.
Não foi possível enviar a notificação SMS.
Não foi possível estabelecer ligação ao servidor.
```

## Estados vazios

``` text
Nenhum aluno registado.
Nenhum professor registado.
Nenhuma falta encontrada para os filtros seleccionados.
Nenhum caso de PPF registado.
Não existem aulas atribuídas para hoje.
```

------------------------------------------------------------------------

# 13. Sistema Visual Aprovado --- Design sem Copy

A direcção visual deve ser leve, profissional e adequada a um sistema
académico. Evitar cores excessivamente saturadas ou pesadas.

## 13.1 Cores Primárias

-   Azul principal: `#2563B9`
-   Azul médio: `#3B82D0`
-   Azul suave: `#A9C7F5`

Utilização:

-   navegação activa;
-   botões principais;
-   links;
-   elementos de destaque;
-   indicadores seleccionados.

## 13.2 Cores Secundárias

Usadas apenas para estados e indicadores:

-   Verde suave: `#45B97C`
-   Âmbar suave: `#F3AE3D`
-   Coral/vermelho suave: `#ED6257`
-   Roxo suave: `#8359D5`
-   Cinza azulado: `#6E7885`

## 13.3 Neutras

-   Texto principal: `#253142`
-   Texto secundário: `#6E7885`
-   Bordas: `#D7DDE5`
-   Fundo secundário: `#F3F6FA`
-   Fundo principal/cartões: `#FFFFFF`

## 13.4 Princípios visuais

-   fundos claros;
-   bastante espaço em branco;
-   cartões discretos;
-   bordas leves;
-   cantos moderadamente arredondados;
-   sombras mínimas;
-   navegação lateral consistente;
-   tabelas limpas;
-   formulários com hierarquia clara;
-   cores de estado utilizadas apenas quando acrescentarem significado;
-   evitar gradientes e efeitos decorativos desnecessários na Fase 1.

------------------------------------------------------------------------

# 14. Referência Visual do Design

A referência visual criada para o StudentControl contém:

-   sistema de cores;
-   componentes;
-   login;
-   dashboard da secretaria;
-   lista de alunos;
-   formulário de aluno;
-   perfil do aluno;
-   professores;
-   encarregados;
-   turmas;
-   detalhes da turma;
-   ecrã de chamada;
-   dashboard do encarregado.

**Ficheiro visual de referência:** `studentcontrol_design_reference.png`

> Nota: a imagem é uma referência de composição e linguagem visual. As
> copies definitivas são as estabelecidas neste documento e serão
> aplicadas durante a implementação.

------------------------------------------------------------------------

# 15. Organização do Backend

``` text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── alunoController.js
│   ├── professorController.js
│   ├── encarregadoController.js
│   ├── turmaController.js
│   ├── disciplinaController.js
│   ├── associacaoController.js
│   ├── aulaController.js
│   ├── presencaController.js
│   ├── justificacaoController.js
│   ├── ppfController.js
│   └── dashboardController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── alunoRoutes.js
│   ├── professorRoutes.js
│   ├── encarregadoRoutes.js
│   ├── turmaRoutes.js
│   ├── disciplinaRoutes.js
│   ├── associacaoRoutes.js
│   ├── aulaRoutes.js
│   ├── presencaRoutes.js
│   ├── ppfRoutes.js
│   └── dashboardRoutes.js
│
├── services/
│   ├── smsService.js
│   └── ppfService.js
│
├── utils/
│   ├── validators.js
│   └── helpers.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

------------------------------------------------------------------------

# 16. API REST Planeada

## Autenticação

``` text
POST /api/auth/login
GET  /api/auth/me
```

## Professores

``` text
GET    /api/professores
GET    /api/professores/:id
POST   /api/professores
PUT    /api/professores/:id
DELETE /api/professores/:id
```

## Alunos

``` text
GET    /api/alunos
GET    /api/alunos/:id
POST   /api/alunos
PUT    /api/alunos/:id
DELETE /api/alunos/:id

GET /api/alunos/:id/encarregados
GET /api/alunos/:id/faltas
GET /api/alunos/:id/presencas
GET /api/alunos/:id/ppf
```

## Encarregados

``` text
GET    /api/encarregados
GET    /api/encarregados/:id
POST   /api/encarregados
PUT    /api/encarregados/:id
DELETE /api/encarregados/:id

POST /api/alunos/:id/encarregados
```

## Turmas

``` text
GET  /api/turmas
GET  /api/turmas/:id
POST /api/turmas
PUT  /api/turmas/:id

GET /api/turmas/:id/alunos
```

## Disciplinas

``` text
GET  /api/disciplinas
POST /api/disciplinas
PUT  /api/disciplinas/:id
```

## Associações

``` text
POST /api/associacoes
```

## Aulas

``` text
POST /api/aulas
GET  /api/aulas
GET  /api/aulas/:id
GET  /api/aulas/professor/:id
POST /api/aulas/:id/chamada
```

## Presenças e justificações

``` text
PUT /api/presencas/:id/justificar
```

## PPF

``` text
GET /api/ppf
GET /api/ppf/:id
GET /api/alunos/:id/ppf
```

## Dashboards

``` text
GET /api/dashboard/secretaria
GET /api/dashboard/professor
GET /api/dashboard/encarregado
```

------------------------------------------------------------------------

# 17. Fluxo Principal do Backend

## 17.1 Chamada

``` text
Professor autenticado
        |
        v
Selecciona aula
        |
        v
Backend verifica se a aula pertence ao professor
        |
        v
Professor marca estudantes
        |
        v
Submete chamada
        |
        v
Backend valida os dados
        |
        v
Grava presenças/faltas
        |
        v
Encerra chamada
        |
        +-----------------------+
        |                       |
        v                       v
Processar SMS              Contar faltas
                                |
                                v
                           Verificar PPF
                                |
                         +------|------+
                         |             |
                        NÃO           SIM
                         |             |
                         v             v
                       Fim       Criar PPF
                                      |
                                      v
                                Processar SMS PPF
```

## 17.2 Justificação

``` text
Secretaria autenticada
        |
        v
Selecciona falta
        |
        v
Informa motivo
        |
        v
Backend verifica perfil
        |
        v
Regista justificação
        |
        v
Mantém histórico da falta
        |
        v
Falta deixa de contar como não justificada
```

------------------------------------------------------------------------

# 18. Plano de Desenvolvimento por Fases

## Fase 0 --- Preparação

-   verificar Node.js;
-   instalar/configurar MySQL;
-   preparar VS Code;
-   preparar Postman;
-   criar repositório Git;
-   criar estrutura `frontend`, `backend`, `database` e `docs`.

**Resultado:** ambiente pronto.

## Fase 1 --- Base de dados

-   criar `studentcontrol`;
-   criar tabelas;
-   definir chaves primárias e estrangeiras;
-   criar relações;
-   inserir dados iniciais de teste.

**Resultado:** MySQL funcional.

## Fase 2 --- Backend base

-   inicializar Node.js;
-   instalar Express;
-   configurar `mysql2`;
-   configurar `.env`;
-   testar ligação Node ↔ MySQL;
-   criar servidor;
-   padronizar respostas e erros.

**Resultado:** API base funcional.

## Fase 3 --- Autenticação e segurança

-   login;
-   bcryptjs;
-   JWT;
-   middleware de autenticação;
-   middleware de perfis;
-   logout no frontend posteriormente.

**Resultado:** acessos protegidos.

## Fase 4 --- Módulos administrativos

Implementar CRUD de:

-   professores;
-   alunos;
-   encarregados;
-   turmas;
-   disciplinas;
-   associações académicas.

**Resultado:** secretaria consegue preparar a estrutura da escola.

## Fase 5 --- Aulas

-   criar aulas;
-   associar aula a professor, disciplina e turma;
-   listar aulas do professor;
-   controlar estado da aula.

**Resultado:** professor recebe as aulas correctas.

## Fase 6 --- Chamada e assiduidade

-   listar alunos da turma;
-   marcar PRESENTE/FALTA;
-   validar chamada;
-   confirmar;
-   guardar;
-   impedir duplicação.

**Resultado:** controlo de assiduidade funcional.

## Fase 7 --- SMS simulado

-   criar `smsService`;
-   implementar `SMS_MODE=simulation`;
-   gerar notificações;
-   guardar histórico.

**Resultado:** fluxo de SMS testável sem custos.

## Fase 8 --- Justificações

-   endpoint de justificação;
-   restrição à secretaria;
-   motivo;
-   observação;
-   utilizador responsável;
-   data/hora;
-   preservação do histórico.

**Resultado:** faltas justificadas correctamente.

## Fase 9 --- PPF

-   contar faltas não justificadas por aluno/disciplina;
-   verificar limite;
-   criar PPF;
-   impedir duplicados;
-   processar SMS de PPF.

**Resultado:** PPF automática.

## Fase 10 --- Frontend base

-   criar React + Vite;
-   implementar sistema visual aprovado;
-   criar layout;
-   menu;
-   rotas;
-   componentes;
-   formulários;
-   tabelas.

**Resultado:** interface navegável.

## Fase 11 --- Frontend Secretaria

Implementar:

-   dashboard;
-   alunos;
-   professores;
-   encarregados;
-   turmas;
-   disciplinas;
-   associações;
-   faltas;
-   justificações;
-   PPF.

## Fase 12 --- Frontend Professor

Implementar:

-   dashboard;
-   minhas turmas;
-   minhas aulas;
-   fazer chamada;
-   confirmação;
-   histórico.

## Fase 13 --- Frontend Encarregado

Implementar:

-   dashboard;
-   educandos;
-   assiduidade;
-   faltas;
-   avisos.

## Fase 14 --- Integração completa

``` text
React
  ↓
API Express
  ↓
MySQL
  ↓
SMS
```

Testar todos os fluxos com dados reais de demonstração.

## Fase 15 --- SMS real

-   seleccionar fornecedor;
-   obter credenciais;
-   configurar `.env`;
-   activar `SMS_MODE=production`;
-   testar número moçambicano real;
-   testar falhas e estados de envio.

## Fase 16 --- Dashboard e indicadores

-   totais;
-   faltas do dia;
-   faltas não justificadas;
-   PPF;
-   actividade recente;
-   indicadores por perfil.

## Fase 17 --- Segurança e revisão

-   testar permissões;
-   validar inputs;
-   testar JWT;
-   rever queries;
-   rever exposição de dados;
-   rever `.env`;
-   testar erros.

## Fase 18 --- Testes finais

Criar ambiente de demonstração com:

-   secretaria;
-   professores;
-   turmas;
-   disciplinas;
-   alunos;
-   encarregados;
-   aulas;
-   faltas;
-   PPF.

Executar o fluxo completo.

## Fase 19 --- Preparação das Jornadas Científicas

Demonstração sugerida:

1.  Login da secretaria.
2.  Mostrar dashboard.
3.  Mostrar aluno/turma/professor.
4.  Login do professor.
5.  Abrir aula.
6.  Fazer chamada.
7.  Marcar uma falta.
8.  Confirmar chamada.
9.  Demonstrar notificação SMS.
10. Voltar à secretaria.
11. Consultar falta.
12. Demonstrar justificação.
13. Demonstrar um caso preparado de PPF.
14. Mostrar histórico e indicadores.

## Fase 20 --- Documentação e entrega

Produzir:

-   README;
-   requisitos;
-   modelo da base de dados;
-   documentação da API;
-   instruções de instalação;
-   contas de demonstração;
-   arquitectura;
-   manual breve de utilização.

------------------------------------------------------------------------

# 19. Critério de Conclusão da Fase 1

A Fase 1 só será considerada funcional quando o seguinte cenário passar
integralmente:

``` text
Secretaria faz login
        ↓
Cadastra professor
        ↓
Cadastra turma e disciplina
        ↓
Cadastra aluno
        ↓
Cadastra encarregado
        ↓
Associa aluno ao encarregado
        ↓
Associa professor + disciplina + turma
        ↓
Cria/dispõe aula
        ↓
Professor faz login
        ↓
Professor abre aula
        ↓
Faz chamada
        ↓
Marca aluno como faltoso
        ↓
Confirma
        ↓
Falta é guardada
        ↓
SMS é processado
        ↓
Secretaria consulta a falta
        ↓
Secretaria pode justificá-la
        ↓
Faltas não justificadas são contadas
        ↓
Limite é ultrapassado
        ↓
PPF é criada
        ↓
SMS de PPF é processado
        ↓
Encarregado consegue consultar assiduidade
```

Se todas estas operações funcionarem, a **Fase 1 do StudentControl está
concluída**.

------------------------------------------------------------------------

# 20. StudentControl 2.0 --- Depois da Fase 1

As funcionalidades abaixo não devem atrasar a entrega do núcleo:

-   funcionamento offline;
-   sincronização posterior;
-   alerta precoce;
-   Índice de Risco de Abandono;
-   causas do absentismo;
-   módulo de intervenção;
-   relatórios avançados;
-   PWA;
-   QR Code;
-   análise distrital/provincial;
-   monitoria de aulas realizadas;
-   modelos de Machine Learning após obtenção de dados suficientes.

Ordem conceptual:

``` text
Fase 1 funcional
      ↓
Modo offline
      ↓
Dashboard analítico
      ↓
Alerta precoce
      ↓
Causas do absentismo
      ↓
Intervenções
      ↓
Piloto numa escola
      ↓
Avaliação dos resultados
      ↓
Modelos preditivos futuros
```

------------------------------------------------------------------------

# 21. Regra de Desenvolvimento

Durante a implementação seguiremos esta regra:

> **Não avançar para uma funcionalidade dependente enquanto a anterior
> não estiver funcional e testada.**

Assim:

``` text
MySQL
 ↓
Backend
 ↓
Autenticação
 ↓
Cadastros
 ↓
Aulas
 ↓
Chamada
 ↓
Faltas
 ↓
SMS
 ↓
Justificação
 ↓
PPF
 ↓
Frontend completo
 ↓
Testes
```

Isto reduz erros, retrabalho e risco de chegar às Jornadas com várias
telas bonitas mas sem um fluxo funcional completo.

------------------------------------------------------------------------

# 22. Estado do Planeamento

  Área                              Estado
  --------------------------------- ---------------
  Ideia central                     Definida
  Evolução StudentControl 2.0       Definida
  Requisitos funcionais             Definidos
  Requisitos não funcionais         Definidos
  Perfis                            Definidos
  Stack                             Definida
  Arquitectura geral                Definida
  Low-Fi sem copy                   Definido
  Low-Fi com copy                   Definido
  Direcção visual                   Definida
  Cores                             Definidas
  Estrutura do backend              Definida
  API REST inicial                  Definida
  Fases de desenvolvimento          Definidas
  Critério de conclusão da Fase 1   Definido
  Implementação                     Próxima etapa

------------------------------------------------------------------------

## 23. Próximo Passo

Com este documento aprovado, a implementação deve começar pela **Fase 0
--- Preparação do ambiente**, seguida imediatamente pela **Fase 1 ---
Base de dados MySQL**. A partir desse momento, cada fase será
desenvolvida e testada antes de avançarmos para a seguinte.
