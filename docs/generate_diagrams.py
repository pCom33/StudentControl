import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse, ArrowStyle
import os

output_dir = r"P:\Others\StudentControl\docs\diagrams"
os.makedirs(output_dir, exist_ok=True)

# Cores do Sistema
NAVY = "#1B365D"
TEAL = "#0D9488"
SLATE = "#475569"
LIGHT_BG = "#F8FAFC"
CARD_BG = "#FFFFFF"
BORDER = "#CBD5E1"
CORAL = "#E11D48"
AMBER = "#D97706"
GREEN = "#16A34A"

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# ==========================================
# 1. DIAGRAMA DE CASOS DE USO (USE CASE)
# ==========================================
fig, ax = plt.subplots(figsize=(14, 10), dpi=300)
ax.set_facecolor(LIGHT_BG)
fig.patch.set_facecolor(LIGHT_BG)
ax.set_xlim(0, 14)
ax.set_ylim(0, 10)
ax.axis('off')

# Retângulo do Sistema
system_box = FancyBboxPatch((3.2, 0.4), 7.6, 9.2, boxstyle="round,pad=0.2",
                            facecolor=CARD_BG, edgecolor=NAVY, linewidth=2)
ax.add_patch(system_box)
ax.text(7.0, 9.3, "Sistema StudentControl (Fronteira do Sistema)", 
        fontsize=14, weight='bold', color=NAVY, ha='center', va='center')

# Atores (Esquerda e Direita)
actors = [
    {"name": "Secretaria Geral\n(Administrador)", "x": 1.5, "y": 7.5, "color": NAVY},
    {"name": "Professor\n(Docente)", "x": 1.5, "y": 4.2, "color": TEAL},
    {"name": "Encarregado\nde Educação", "x": 1.5, "y": 1.5, "color": AMBER},
    {"name": "Gateway de SMS\n(Infobip / TextBee)", "x": 12.5, "y": 4.5, "color": CORAL}
]

for act in actors:
    # Cabeça
    circle = plt.Circle((act["x"], act["y"] + 0.5), 0.28, color=act["color"], ec=NAVY, lw=1.5)
    ax.add_patch(circle)
    # Corpo
    ax.plot([act["x"], act["x"]], [act["y"] + 0.22, act["y"] - 0.25], color=NAVY, lw=2)
    # Braços
    ax.plot([act["x"] - 0.35, act["x"] + 0.35], [act["y"] + 0.05, act["y"] + 0.05], color=NAVY, lw=2)
    # Pernas
    ax.plot([act["x"], act["x"] - 0.3], [act["y"] - 0.25, act["y"] - 0.6], color=NAVY, lw=2)
    ax.plot([act["x"], act["x"] + 0.3], [act["y"] - 0.25, act["y"] - 0.6], color=NAVY, lw=2)
    # Rótulo
    ax.text(act["x"], act["y"] - 0.85, act["name"], fontsize=10, weight='bold', color=NAVY, ha='center', va='top')

# Casos de Uso (Elipses)
use_cases = [
    {"id": "uc1", "text": "Autenticar no Sistema\n(Login JWT)", "x": 7.0, "y": 8.5},
    {"id": "uc2", "text": "Gerir Utilizadores, Turmas\ne Alunos", "x": 5.4, "y": 7.3},
    {"id": "uc3", "text": "Associar Professor\n+ Disciplina + Turma", "x": 8.6, "y": 7.3},
    {"id": "uc4", "text": "Justificar Faltas com\nDocumento Comprovativo", "x": 5.4, "y": 6.0},
    {"id": "uc5", "text": "Disparar SMS em Lote\n(Broadcast Geral/Turma)", "x": 8.6, "y": 6.0},
    {"id": "uc6", "text": "Realizar e Fechar Chamada\npor Aula", "x": 5.4, "y": 4.5},
    {"id": "uc7", "text": "Calcular Faltas e\nGerar Alerta de PPF", "x": 8.6, "y": 4.5},
    {"id": "uc8", "text": "Despachar Notificação SMS\nInstantânea de Falta", "x": 8.6, "y": 3.1},
    {"id": "uc9", "text": "Consultar Histórico e\nAssiduidade do Educando", "x": 5.4, "y": 2.0},
    {"id": "uc10", "text": "Visualizar Dashboards\ne Indicadores de Risco", "x": 7.0, "y": 1.0}
]

for uc in use_cases:
    ellipse = Ellipse((uc["x"], uc["y"]), width=2.6, height=0.75,
                      facecolor="#E0F2FE", edgecolor=NAVY, linewidth=1.5)
    ax.add_patch(ellipse)
    ax.text(uc["x"], uc["y"], uc["text"], fontsize=8.5, weight='bold', color=NAVY, ha='center', va='center')

# Linhas de Associação Ator -> Caso de Uso
lines = [
    # Secretaria
    ((1.5, 7.5), (7.0, 8.5)),
    ((1.5, 7.5), (5.4, 7.3)),
    ((1.5, 7.5), (8.6, 7.3)),
    ((1.5, 7.5), (5.4, 6.0)),
    ((1.5, 7.5), (8.6, 6.0)),
    ((1.5, 7.5), (7.0, 1.0)),
    # Professor
    ((1.5, 4.2), (7.0, 8.5)),
    ((1.5, 4.2), (5.4, 4.5)),
    ((1.5, 4.2), (7.0, 1.0)),
    # Encarregado
    ((1.5, 1.5), (7.0, 8.5)),
    ((1.5, 1.5), (5.4, 2.0)),
    ((1.5, 1.5), (7.0, 1.0)),
    # Gateway SMS
    ((12.5, 4.5), (8.6, 3.1)),
    ((12.5, 4.5), (8.6, 6.0)),
]

for (x1, y1), (x2, y2) in lines:
    ax.plot([x1, x2], [y1, y2], color=SLATE, lw=1.2, linestyle='-')

# Relações de «include» e «extend»
# UC6 (Chamada) inclui UC7 (PPF) e UC8 (SMS)
ax.annotate("«include»", xy=(8.6, 3.5), xytext=(6.5, 4.0),
            arrowprops=dict(arrowstyle="->", color=CORAL, lw=1.4, linestyle="--"),
            fontsize=8, color=CORAL, weight='bold')

ax.annotate("«include»", xy=(7.4, 4.5), xytext=(6.7, 4.5),
            arrowprops=dict(arrowstyle="->", color=CORAL, lw=1.4, linestyle="--"),
            fontsize=8, color=CORAL, weight='bold')

plt.title("Diagrama de Casos de Uso - StudentControl", fontsize=16, weight='bold', color=NAVY, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "diagram_use_case.png"), dpi=300, bbox_inches='tight')
plt.close()

# ==========================================
# 2. DIAGRAMA DE ACTIVIDADE: CHAMADA E SMS
# ==========================================
fig, ax = plt.subplots(figsize=(11, 14), dpi=300)
ax.set_facecolor(LIGHT_BG)
fig.patch.set_facecolor(LIGHT_BG)
ax.set_xlim(0, 10)
ax.set_ylim(0, 15)
ax.axis('off')

# Nadadeiras (Swimlanes): Professor vs Sistema vs Gateway/Encarregado
ax.plot([3.3, 3.3], [0.5, 14.2], color=BORDER, lw=1.8, linestyle='--')
ax.plot([6.8, 6.8], [0.5, 14.2], color=BORDER, lw=1.8, linestyle='--')

ax.text(1.65, 14.5, "Professor", fontsize=13, weight='bold', color=NAVY, ha='center')
ax.text(5.05, 14.5, "Sistema (Backend/TiDB)", fontsize=13, weight='bold', color=NAVY, ha='center')
ax.text(8.4, 14.5, "Gateway SMS / Encarregado", fontsize=13, weight='bold', color=NAVY, ha='center')

def draw_activity_node(ax, x, y, text, w=2.6, h=0.8, color="#FFFFFF", border=NAVY):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.15",
                         facecolor=color, edgecolor=border, linewidth=1.6)
    ax.add_patch(box)
    ax.text(x, y, text, fontsize=8.5, weight='bold', color=NAVY, ha='center', va='center')

# Nó inicial
start = plt.Circle((1.65, 13.8), 0.22, color=NAVY)
ax.add_patch(start)

# Passos
draw_activity_node(ax, 1.65, 12.8, "Iniciar Sessão e\nAceder ao Ecrã de Chamada")
draw_activity_node(ax, 1.65, 11.5, "Seleccionar Turma\ne Disciplina Activa")
draw_activity_node(ax, 1.65, 10.2, "Marcar Alunos:\nPresente ou Falta")
draw_activity_node(ax, 1.65, 8.9, "Submeter Chamada\nda Aula")

draw_activity_node(ax, 5.05, 8.9, "Registar Presenças\nna Base de Dados", color="#E0F2FE")

# Decisão: Aluno Faltou?
decision = patches.Polygon([[5.05, 7.8], [5.8, 7.3], [5.05, 6.8], [4.3, 7.3]],
                           closed=True, facecolor="#FEF08A", edgecolor=NAVY, lw=1.5)
ax.add_patch(decision)
ax.text(5.05, 7.3, "Aluno\nFaltou?", fontsize=8, weight='bold', color=NAVY, ha='center', va='center')

# Ramo Não
draw_activity_node(ax, 3.8, 5.7, "Arquivar como\nPresença Normal", color="#DCFCE7", border=GREEN, w=2.0)

# Ramo Sim
draw_activity_node(ax, 5.05, 4.6, "Contabilizar Faltas\ne Verificar Limite PPF", color="#FEE2E2", border=CORAL)
draw_activity_node(ax, 5.05, 3.3, "Localizar Encarregado(a)\ne Montar Mensagem Oficial", color="#E0F2FE")

draw_activity_node(ax, 8.4, 3.3, "Disparar SMS via API\n(Infobip ou TextBee SIM)", color="#FFEDD5", border=AMBER)
draw_activity_node(ax, 8.4, 2.0, "Encarregado Recebe SMS\nno Telemóvel", color="#DCFCE7", border=GREEN)

draw_activity_node(ax, 5.05, 1.0, "Registar Notificação\ncomo 'ENVIADO'", color="#E0F2FE")

# Nó final
final_outer = plt.Circle((5.05, 0.2), 0.22, color=NAVY, fill=False, lw=1.6)
final_inner = plt.Circle((5.05, 0.2), 0.14, color=NAVY)
ax.add_patch(final_outer)
ax.add_patch(final_inner)

# Conexões (Setas)
arrows = [
    ((1.65, 13.55), (1.65, 13.2)),
    ((1.65, 12.4), (1.65, 11.9)),
    ((1.65, 11.1), (1.65, 10.6)),
    ((1.65, 9.8), (1.65, 9.3)),
    ((2.95, 8.9), (3.75, 8.9)),
    ((5.05, 8.5), (5.05, 7.8)),
    # Da decisão
    ((4.3, 7.3), (3.8, 6.1)), # Não
    ((5.05, 6.8), (5.05, 5.0)), # Sim
    ((5.05, 4.2), (5.05, 3.7)),
    ((6.35, 3.3), (7.1, 3.3)),
    ((8.4, 2.9), (8.4, 2.4)),
    ((7.1, 1.8), (6.35, 1.0)),
    ((3.8, 5.3), (4.5, 0.4)),
    ((5.05, 0.6), (5.05, 0.43))
]

for (x1, y1), (x2, y2) in arrows:
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", color=NAVY, lw=1.4))

ax.text(3.9, 6.8, "Não", fontsize=8.5, weight='bold', color=GREEN)
ax.text(5.25, 6.0, "Sim", fontsize=8.5, weight='bold', color=CORAL)

plt.title("Diagrama de Actividades - Realização de Chamada e Envio de SMS",
          fontsize=15, weight='bold', color=NAVY, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "diagram_activity_attendance.png"), dpi=300, bbox_inches='tight')
plt.close()

# ==========================================
# 3. DIAGRAMA DE ACTIVIDADE: JUSTIFICAÇÃO
# ==========================================
fig, ax = plt.subplots(figsize=(10, 11), dpi=300)
ax.set_facecolor(LIGHT_BG)
fig.patch.set_facecolor(LIGHT_BG)
ax.set_xlim(0, 10)
ax.set_ylim(0, 11)
ax.axis('off')

ax.plot([5.0, 5.0], [0.5, 10.2], color=BORDER, lw=1.8, linestyle='--')
ax.text(2.5, 10.5, "Encarregado de Educação", fontsize=12, weight='bold', color=NAVY, ha='center')
ax.text(7.5, 10.5, "Secretaria Geral (Escola)", fontsize=12, weight='bold', color=NAVY, ha='center')

start = plt.Circle((2.5, 9.8), 0.20, color=NAVY)
ax.add_patch(start)

draw_activity_node(ax, 2.5, 8.8, "Recebe SMS de Alerta\nde Falta do Educando")
draw_activity_node(ax, 2.5, 7.4, "Dirige-se à Secretaria com\nAtestado/Justificativo Médico")
draw_activity_node(ax, 7.5, 7.4, "Recepciona Documento e\nAcede ao Módulo de Faltas", color="#E0F2FE")

# Decisão: Motivo Válido?
dec_just = patches.Polygon([[7.5, 6.4], [8.3, 5.9], [7.5, 5.4], [6.7, 5.9]],
                           closed=True, facecolor="#FEF08A", edgecolor=NAVY, lw=1.5)
ax.add_patch(dec_just)
ax.text(7.5, 5.9, "Motivo\nVálido?", fontsize=8, weight='bold', color=NAVY, ha='center', va='center')

draw_activity_node(ax, 9.0, 4.5, "Recusa Justificação e\nMantém Falta Activa", color="#FEE2E2", border=CORAL, w=2.4)
draw_activity_node(ax, 6.0, 4.5, "Regista Justificação e\nAnexa Comprovativo", color="#DCFCE7", border=GREEN, w=2.4)

draw_activity_node(ax, 6.0, 3.0, "Sistema Recalcula Faltas\ne Subtrai do Limite PPF", color="#E0F2FE")
draw_activity_node(ax, 6.0, 1.6, "Actualiza Painel do Encarregado\ne Emite Recibo Escolar", color="#E0F2FE")

final_outer = plt.Circle((7.5, 0.4), 0.22, color=NAVY, fill=False, lw=1.6)
final_inner = plt.Circle((7.5, 0.4), 0.14, color=NAVY)
ax.add_patch(final_outer)
ax.add_patch(final_inner)

# Conexões
arrows_just = [
    ((2.5, 9.6), (2.5, 9.2)),
    ((2.5, 8.4), (2.5, 7.8)),
    ((3.8, 7.4), (6.2, 7.4)),
    ((7.5, 7.0), (7.5, 6.4)),
    ((8.3, 5.9), (9.0, 4.9)), # Não
    ((6.7, 5.9), (6.0, 4.9)), # Sim
    ((6.0, 4.1), (6.0, 3.4)),
    ((6.0, 2.6), (6.0, 2.0)),
    ((6.0, 1.2), (7.3, 0.5)),
    ((9.0, 4.1), (7.7, 0.5))
]

for (x1, y1), (x2, y2) in arrows_just:
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", color=NAVY, lw=1.4))

ax.text(8.8, 5.6, "Não", fontsize=8.5, weight='bold', color=CORAL)
ax.text(6.1, 5.6, "Sim", fontsize=8.5, weight='bold', color=GREEN)

plt.title("Diagrama de Actividades - Justificação de Faltas e Integridade",
          fontsize=15, weight='bold', color=NAVY, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "diagram_activity_justification.png"), dpi=300, bbox_inches='tight')
plt.close()

# ==========================================
# 4. DIAGRAMA DE ARQUITECTURA DO SISTEMA
# ==========================================
fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
ax.set_facecolor(LIGHT_BG)
fig.patch.set_facecolor(LIGHT_BG)
ax.set_xlim(0, 13)
ax.set_ylim(0, 8)
ax.axis('off')

# Caixas de Camada
def draw_arch_box(ax, x, y, w, h, title, subtitle, color, border, icon_text=""):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2",
                         facecolor=color, edgecolor=border, linewidth=2)
    ax.add_patch(box)
    ax.text(x + w/2, y + h - 0.45, title, fontsize=11, weight='bold', color=NAVY, ha='center')
    ax.text(x + w/2, y + h/2 - 0.1, subtitle, fontsize=8.5, color=SLATE, ha='center', va='center')

# 1. Clientes / Dispositivos
draw_arch_box(ax, 0.5, 4.5, 3.2, 2.8, "Camada de Apresentação\n(Frontend SPA)",
              "React 19 + Vite 7\nTailwind/CSS Moderno\nResponsive (Mobile / PC)\nHospedagem: Vercel (HTTPS)",
              "#EFF6FF", NAVY)

# 2. Servidor Backend
draw_arch_box(ax, 4.8, 4.5, 3.4, 2.8, "Camada de Negócio\n(REST API)",
              "Node.js + Express 5\nAutenticação JWT + Bcrypt\nMotor de Regras PPF\nCORS + Middleware RBAC\nHospedagem: Render (Cloud)",
              "#F0FDFA", TEAL)

# 3. Base de Dados
draw_arch_box(ax, 9.3, 4.5, 3.2, 2.8, "Camada de Persistência\n(Base de Dados)",
              "TiDB Cloud (Serverless)\nMySQL 8.0 Compatível\nConexão Segura TLS/SSL\n13 Tabelas Relacionais\nBackup & Audit Logs",
              "#FEF3C7", AMBER)

# 4. Gateways de SMS
draw_arch_box(ax, 4.8, 0.6, 3.4, 2.6, "Camada de Telecomunicações\n(SMS Gateway Híbrido)",
              "Opção A: Infobip Cloud API\nOpção B: TextBee Android Gateway\n(SIM Local Movitel / Vodacom)\nFormato E.164 (+258...)\nFila de Envio e Retry",
              "#FFF1F2", CORAL)

# 5. Destinatários Finais
draw_arch_box(ax, 9.3, 0.6, 3.2, 2.6, "Destinatários Finais\n(Inclusão Digital)",
              "Encarregados de Educação\nTelemóveis Básicos (2G/3G/4G)\nSem Necessidade de Internet\nRecepção Imediata de SMS\nRedes: Movitel, Vodacom, Tmcel",
              "#F0FDF4", GREEN)

# Setas de Comunicação
# Frontend <-> Backend
ax.annotate("", xy=(4.8, 5.9), xytext=(3.7, 5.9),
            arrowprops=dict(arrowstyle="<->", color=NAVY, lw=2))
ax.text(4.25, 6.2, "HTTPS / JSON\nREST API", fontsize=7.5, weight='bold', color=NAVY, ha='center')

# Backend <-> Database
ax.annotate("", xy=(9.3, 5.9), xytext=(8.2, 5.9),
            arrowprops=dict(arrowstyle="<->", color=TEAL, lw=2))
ax.text(8.75, 6.2, "TCP / SSL (4000)\nSQL Queries", fontsize=7.5, weight='bold', color=TEAL, ha='center')

# Backend -> SMS Gateway
ax.annotate("", xy=(6.5, 3.2), xytext=(6.5, 4.5),
            arrowprops=dict(arrowstyle="->", color=CORAL, lw=2))
ax.text(7.2, 3.85, "POST Disparo\n(REST / Webhook)", fontsize=7.5, weight='bold', color=CORAL, ha='left')

# SMS Gateway -> Encarregado
ax.annotate("", xy=(9.3, 1.9), xytext=(8.2, 1.9),
            arrowprops=dict(arrowstyle="->", color=GREEN, lw=2))
ax.text(8.75, 2.2, "Rede GSM\nSMS PDU", fontsize=7.5, weight='bold', color=GREEN, ha='center')

plt.title("Arquitectura Geral do Sistema StudentControl",
          fontsize=16, weight='bold', color=NAVY, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "diagram_architecture.png"), dpi=300, bbox_inches='tight')
plt.close()

# ==========================================
# 5. DIAGRAMA ENTIDADE-RELACIONAMENTO (DER)
# ==========================================
fig, ax = plt.subplots(figsize=(14, 10), dpi=300)
ax.set_facecolor(LIGHT_BG)
fig.patch.set_facecolor(LIGHT_BG)
ax.set_xlim(0, 14)
ax.set_ylim(0, 10)
ax.axis('off')

def draw_er_table(ax, x, y, title, fields, w=2.4, color="#FFFFFF", header_col=NAVY):
    h = 0.5 + len(fields) * 0.32
    box = FancyBboxPatch((x, y - h), w, h, boxstyle="round,pad=0.1",
                         facecolor=color, edgecolor=header_col, linewidth=1.6)
    ax.add_patch(box)
    header = FancyBboxPatch((x, y - 0.5), w, 0.5, boxstyle="round,pad=0.1",
                            facecolor=header_col, edgecolor=header_col, linewidth=1.6)
    ax.add_patch(header)
    ax.text(x + w/2, y - 0.25, title, fontsize=9.5, weight='bold', color="#FFFFFF", ha='center', va='center')
    
    curr_y = y - 0.75
    for f in fields:
        ax.text(x + 0.15, curr_y, f, fontsize=7.8, color=SLATE, va='center')
        curr_y -= 0.32
    return (x + w/2, y - h/2)

# Tabelas
t_user = draw_er_table(ax, 0.6, 9.4, "USUARIOS",
                       ["PK id (INT)", "nome (VARCHAR)", "email (VARCHAR)", "password_hash (VARCHAR)", "perfil (ENUM)", "activo (TINYINT)"])

t_prof = draw_er_table(ax, 0.6, 6.0, "PROFESSORES",
                       ["PK id (INT)", "FK usuario_id (INT)", "nome (VARCHAR)", "email (VARCHAR)", "telefone (VARCHAR)", "activo (TINYINT)"], header_col=TEAL)

t_disc = draw_er_table(ax, 0.6, 2.8, "DISCIPLINAS",
                       ["PK id (INT)", "nome (VARCHAR)", "limite_ppf (INT)", "activo (TINYINT)"])

t_turma = draw_er_table(ax, 4.0, 9.4, "TURMAS",
                        ["PK id (INT)", "nome (VARCHAR)", "ano_lectivo (VARCHAR)", "classe (VARCHAR)", "turno (ENUM)", "activo (TINYINT)"])

t_pdt = draw_er_table(ax, 4.0, 6.0, "PROF_DISC_TURMA",
                      ["PK id (INT)", "FK professor_id", "FK disciplina_id", "FK turma_id", "activo (TINYINT)"], header_col=TEAL)

t_aluno = draw_er_table(ax, 7.4, 9.4, "ALUNOS",
                        ["PK id (INT)", "nome (VARCHAR)", "numero_aluno (VARCHAR)", "data_nascimento (DATE)", "FK turma_id (INT)", "activo (TINYINT)"])

t_ae = draw_er_table(ax, 7.4, 5.8, "ALUNO_ENCARREGADO",
                     ["PK,FK aluno_id (INT)", "PK,FK encarregado_id (INT)"])

t_enc = draw_er_table(ax, 7.4, 3.8, "ENCARREGADOS",
                      ["PK id (INT)", "FK usuario_id (INT)", "nome (VARCHAR)", "telefone (VARCHAR)", "email (VARCHAR)", "parentesco (VARCHAR)"], header_col=AMBER)

t_aula = draw_er_table(ax, 4.0, 2.8, "AULAS",
                      ["PK id (INT)", "FK professor_id", "FK disciplina_id", "FK turma_id", "data_aula (DATE)", "hora_inicio / fim", "estado (ENUM)"], header_col=TEAL)

t_pres = draw_er_table(ax, 10.8, 9.4, "PRESENCAS",
                       ["PK id (INT)", "FK aula_id (INT)", "FK aluno_id (INT)", "estado (ENUM)", "justificada (TINYINT)", "FK marcada_por (INT)"])

t_just = draw_er_table(ax, 10.8, 5.8, "JUSTIFICACOES",
                       ["PK id (INT)", "FK presenca_id (INT)", "FK justificado_por", "motivo (VARCHAR)", "documento_anexo", "observacao (TEXT)"], header_col=GREEN)

t_ppf = draw_er_table(ax, 10.8, 2.5, "PPF",
                      ["PK id (INT)", "FK aluno_id (INT)", "FK disciplina_id (INT)", "faltas_nao_justificadas", "estado (ENUM)"], header_col=CORAL)

t_notif = draw_er_table(ax, 4.0, 0.4, "NOTIFICACOES",
                        ["PK id (INT)", "FK encarregado_id", "tipo (ENUM)", "destinatario (VARCHAR)", "mensagem (TEXT)", "estado (ENUM)"], header_col=CORAL)

# Linhas de Relacionamento (DER)
er_lines = [
    (t_user, t_prof),
    (t_user, t_enc),
    (t_prof, t_pdt),
    (t_disc, t_pdt),
    (t_turma, t_pdt),
    (t_turma, t_aluno),
    (t_aluno, t_ae),
    (t_enc, t_ae),
    (t_pdt, t_aula),
    (t_aluno, t_pres),
    (t_aula, t_pres),
    (t_pres, t_just),
    (t_aluno, t_ppf),
    (t_enc, t_notif)
]

for (x1, y1), (x2, y2) in er_lines:
    ax.plot([x1, x2], [y1, y2], color=SLATE, lw=1.2, linestyle=':')

plt.title("Modelo Entidade-Relacionamento (DER Lógico) - StudentControl",
          fontsize=16, weight='bold', color=NAVY, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "diagram_er.png"), dpi=300, bbox_inches='tight')
plt.close()

print("Todos os 5 diagramas foram gerados com sucesso em:", output_dir)
