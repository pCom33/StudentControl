import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_PATH = r"P:\Others\StudentControl\docs\Documentacao_StudentControl.docx"
ARTIFACT_OUTPUT_PATH = r"C:\Users\Perci\.gemini\antigravity\brain\bf6dc20d-f234-41cf-b22f-90c969937a81\Documentacao_StudentControl.docx"
DIAGRAMS_DIR = r"P:\Others\StudentControl\docs\diagrams"

doc = Document()

# Configuração de Margens (A4, 2.5 cm = 0.98 in)
sections = doc.sections
for s in sections:
    s.top_margin = Inches(1.0)
    s.bottom_margin = Inches(1.0)
    s.left_margin = Inches(1.0)
    s.right_margin = Inches(1.0)

# Paleta de Cores
COLOR_PRIMARY = RGBColor(27, 54, 93)     # Navy #1B365D
COLOR_SECONDARY = RGBColor(13, 148, 136) # Teal #0D9488
COLOR_DARK = RGBColor(30, 41, 59)        # Slate #1E293B
COLOR_MUTED = RGBColor(100, 116, 139)    # Muted #64748B

HEX_PRIMARY = "1B365D"
HEX_LIGHT_ROW = "F8FAFC"
HEX_BORDER = "CBD5E1"
HEX_CALLOUT_BG = "F0FDFA"

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = COLOR_PRIMARY
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = COLOR_SECONDARY
    return p

def add_heading_3(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = COLOR_DARK
    return p

def add_body_p(text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_DARK
    r_text = p.add_run(text)
    r_text.font.name = "Arial"
    r_text.font.size = Pt(10.5)
    r_text.font.italic = italic
    r_text.font.color.rgb = COLOR_DARK
    return p

def add_callout(text, title="NOTA IMPORTANTE:"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, HEX_CALLOUT_BG)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Borda esquerda verde/azul
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_PRIMARY}"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(title + " ")
    r_title.bold = True
    r_title.font.name = "Arial"
    r_title.font.size = Pt(10)
    r_title.font.color.rgb = COLOR_PRIMARY
    
    r_body = p.add_run(text)
    r_body.font.name = "Arial"
    r_body.font.size = Pt(10)
    r_body.font.color.rgb = COLOR_DARK
    
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_after = Pt(4)

def add_image_with_caption(img_path, caption_text, width_inch=6.2):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(width_inch))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(caption_text)
        r_cap.font.name = "Arial"
        r_cap.font.size = Pt(9.5)
        r_cap.font.italic = True
        r_cap.font.bold = True
        r_cap.font.color.rgb = COLOR_MUTED

# ==========================================
# CAPA FORMAL DO PROJECTO
# ==========================================
p_cover_top = doc.add_paragraph()
p_cover_top.paragraph_format.space_before = Pt(36)
p_cover_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_univ = p_cover_top.add_run("JORNADAS CIENTÍFICAS UNIVERSITÁRIAS 2026\n")
r_univ.font.name = "Arial"
r_univ.font.size = Pt(13)
r_univ.font.bold = True
r_univ.font.color.rgb = COLOR_PRIMARY

r_fac = p_cover_top.add_run("FACULDADE DE CIÊNCIAS E TECNOLOGIA / ENGENHARIA INFORMÁTICA\n")
r_fac.font.name = "Arial"
r_fac.font.size = Pt(11)
r_fac.font.bold = True
r_fac.font.color.rgb = COLOR_MUTED

p_divider = doc.add_paragraph()
p_divider.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_divider.paragraph_format.space_before = Pt(30)
p_divider.paragraph_format.space_after = Pt(30)
r_div = p_divider.add_run("—" * 28)
r_div.font.color.rgb = COLOR_SECONDARY

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_before = Pt(10)
p_title.paragraph_format.space_after = Pt(12)
r_t = p_title.add_run("StudentControl\n")
r_t.font.name = "Arial"
r_t.font.size = Pt(28)
r_t.font.bold = True
r_t.font.color.rgb = COLOR_PRIMARY

r_sub = p_title.add_run("Sistema Web de Controlo de Presenças e Faltas de Estudantes com Notificação Automática por SMS aos Encarregados de Educação\n")
r_sub.font.name = "Arial"
r_sub.font.size = Pt(14)
r_sub.font.bold = True
r_sub.font.color.rgb = COLOR_SECONDARY

p_lema = doc.add_paragraph()
p_lema.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_lema.paragraph_format.space_before = Pt(20)
p_lema.paragraph_format.space_after = Pt(40)
r_lem1 = p_lema.add_run("LEMA DA CONFERÊNCIA:\n")
r_lem1.font.size = Pt(10)
r_lem1.font.bold = True
r_lem1.font.color.rgb = COLOR_MUTED

r_lem2 = p_lema.add_run("«INOVAÇÃO TECNOLÓGICA E INTEGRIDADE ACADÊMICA: O PAPEL DAS INSTITUIÇÕES DO ENSINO SUPERIOR NO DESENVOLVIMENTO DA CIÊNCIA»")
r_lem2.font.size = Pt(11)
r_lem2.font.bold = True
r_lem2.font.italic = True
r_lem2.font.color.rgb = COLOR_DARK

p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_meta.paragraph_format.space_before = Pt(80)
r_meta = p_meta.add_run("DOCUMENTAÇÃO TÉCNICA E DE ENGENHARIA DE SOFTWARE\nVersão de Produção 1.0\nMoçambique — 2026")
r_meta.font.name = "Arial"
r_meta.font.size = Pt(10.5)
r_meta.font.bold = True
r_meta.font.color.rgb = COLOR_MUTED

doc.add_page_break()

# ==========================================
# RESUMO EXECUTIVO (ABSTRACT)
# ==========================================
add_heading_1("Resumo Executivo")
add_body_p(
    "O presente documento apresenta a especificação técnica formal, análise de requisitos, modelação arquitetural e de dados do sistema StudentControl, concebido e desenvolvido no âmbito das Jornadas Científicas Universitárias sob o lema «Inovação Tecnológica e Integridade Académica: O Papel das Instituições do Ensino Superior no Desenvolvimento da Ciência»."
)
add_body_p(
    "O absentismo e o abandono escolar precoce, particularmente no ensino primário e secundário em países em desenvolvimento como Moçambique, representam entraves estruturais ao desenvolvimento humano e socioeconómico. Tradicionalmente, o registo de assiduidade é efetuado em cadernos de chamada manuais, vulneráveis a rasuras, extravio e sem comunicação atempada com os encarregados de educação, que muitas vezes tomam conhecimento das ausências apenas quando a reprovação por faltas (PPF) se torna irremediável."
)
add_body_p(
    "O StudentControl resolve esta lacuna através de uma plataforma Web em nuvem (React 19 + Node.js + TiDB Serverless) acoplada a um motor de telecomunicações móveis (SMS Gateway híbrido via Infobip e gateway Android TextBee local). O sistema permite que o professor realize a chamada em menos de 60 segundos por aula; havendo registo de falta, a plataforma dispara imediatamente uma notificação por SMS para o telemóvel simples do encarregado de educação, sem exigir acesso à internet móvel ou smartphones por parte da família. Adicionalmente, o sistema automatiza o cálculo de faltas não justificadas e alerta atempadamente as situações de Punição por Faltas (PPF), salvaguardando a integridade pedagógica e aproximando a escola da comunidade."
)
add_body_p(
    "Palavras-chave: Controlo de Assiduidade; Notificação por SMS; Integridade Académica; Inclusão Digital; Punição por Faltas (PPF); Engenharia de Software; TiDB Cloud; Moçambique.",
    italic=True
)

add_callout(
    "O sistema encontra-se 100% implementado, testado e em produção activa, acessível publicamente através do endereço: https://student-control-two.vercel.app e com API REST em: https://studentcontrol.onrender.com/api.",
    "STATUS DE IMPLANTAÇÃO:"
)

# ==========================================
# 1. INTRODUÇÃO E ENQUADRAMENTO TEÓRICO
# ==========================================
add_heading_1("1. Introdução e Enquadramento do Projecto")

add_heading_2("1.1 Contexto e Problemática")
add_body_p(
    "A assiduidade discente é um dos preditores mais consistentes do aproveitamento pedagógico, da retenção escolar e da consolidação das aprendizagens elementares. No contexto das escolas primárias moçambicanas, a monitoria presencial ainda depende maciçamente de livros de ponto físicos e mapas mensais manuais."
)
add_body_p(
    "Este modelo tradicional acarreta graves constrangimentos: (1) morosidade no processamento das faltas; (2) falta de transparência e vulnerabilidade a adulterações; (3) ausência de comunicação imediata com as famílias, permitindo que crianças saiam de casa sem comparecer à sala de aula sem que os pais saibam; e (4) aplicação tardia dos regulamentos pedagógicos de Punição por Faltas (PPF), quando o aluno já não dispõe de tempo lectivo hábil para recuperação."
)

add_heading_2("1.2 Alinhamento com o Lema das Jornadas Científicas")
add_body_p(
    "O desenvolvimento do StudentControl consubstancia rigorosamente os pilares do lema da conferência:",
    bold_prefix="Articulação com a Ciência Universitária: "
)
add_body_p(
    "1. Inovação Tecnológica com Inclusão Real: Ao adoptar SMS institucional compatível com qualquer telemóvel analógico básico (feature phones 2G/3G nas redes Movitel, Vodacom e Tmcel), o software democratiza a tecnologia e supera a barreira da exclusão digital que inviabilizaria plataformas dependentes de WhatsApp ou dados móveis pagos."
)
add_body_p(
    "2. Integridade Académica e Social: Elimina fraudes na escrituração de presenças, garante auditoria imutável com carimbo temporal e restringe privilégios — somente a Secretaria pode oficializar justificações mediante atestados idóneos, garantindo conformidade com os regulamentos de ensino."
)
add_body_p(
    "3. Papel das Instituições de Ensino Superior: A universidade não se limita à produção teórica; coloca a investigação computacional e a engenharia de software ao serviço das escolas públicas e comunitárias envolventes."
)

add_heading_2("1.3 Objectivos do Projecto")
add_body_p(
    "Desenvolver, implantar e validar um sistema web responsivo para gestão e controlo da assiduidade escolar, com motor de cálculo automatizado de faltas e disparo instantâneo de alertas por SMS aos encarregados de educação.",
    bold_prefix="Objectivo Geral: "
)
add_body_p("Objectivos Específicos:")
add_body_p("• Implementar autenticação segura baseada em JSON Web Tokens (JWT) e controlo de acesso baseado em papéis (RBAC - Secretaria, Professor, Encarregado).")
add_body_p("• Desenvolver módulo de chamada digital rápida com submissão em tempo real.")
add_body_p("• Integrar serviço de mensagens SMS com suporte bidirecional: gateway em nuvem (Infobip) e gateway celular Android local (TextBee).")
add_body_p("• Automatizar o cômputo de faltas não justificadas por disciplina e emissão de alertas precoces de Punição por Faltas (PPF).")
add_body_p("• Disponibilizar módulo exclusivo da secretaria para auditoria e deferimento de justificações com anexos comprobatórios.")
add_body_p("• Criar painéis de gestão analítica com métricas de assiduidade por turma, disciplina e turno.")

# ==========================================
# 2. DESCRIÇÃO GERAL DO SISTEMA
# ==========================================
add_heading_1("2. Descrição Geral do Sistema")

add_heading_2("2.1 Visão Global da Solução")
add_body_p(
    "O StudentControl é arquitectado como uma Single Page Application (SPA) desacoplada de uma API RESTful de alta disponibilidade. A solução opera em ciclo fechado: desde o registo dos dados no início do trimestre até ao encerramento de cada aula e subsequente notificação telefónica."
)

add_heading_2("2.2 Perfis de Utilizador e Matriz de Actores")

# Tabela de Perfis
table_perfis = doc.add_table(rows=4, cols=3)
table_perfis.alignment = WD_TABLE_ALIGNMENT.CENTER
headers = ["Perfil", "Responsabilidade no Sistema", "Principais Privilégios"]
for i, h in enumerate(headers):
    cell = table_perfis.cell(0, i)
    cell.paragraphs[0].add_run(h).bold = True
    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_background(cell, HEX_PRIMARY)
    set_cell_margins(cell, 120, 120, 150, 150)

perfis_data = [
    ("Secretaria Geral (Admin)", "Gestão administrativa escolar, integridade dos cadastros e chancela legal.", "Gerir turmas, professores, disciplinas, alunos e encarregados; Justificar faltas oficialmente; Disparar SMS em lote; Consultar relatórios de PPF."),
    ("Professor (Docente)", "Condução das aulas lectivas e verificação presencial dos estudantes.", "Consultar as suas turmas e disciplinas alocadas; Abrir e fechar a chamada em sala de aula; Marcar 'Presente' ou 'Falta'; Consultar histórico das suas aulas."),
    ("Encarregado de Educação", "Acompanhamento parental do percurso escolar do educando.", "Recepção automática de SMS com alerta de falta e PPF; Acesso ao portal web do encarregado para consultar histórico de assiduidade e presenças dos seus filhos.")
]

for row_idx, data in enumerate(perfis_data, start=1):
    for col_idx, text in enumerate(data):
        cell = table_perfis.cell(row_idx, col_idx)
        cell.paragraphs[0].add_run(text).font.size = Pt(9.5)
        if row_idx % 2 == 1:
            set_cell_background(cell, HEX_LIGHT_ROW)
        set_cell_margins(cell, 100, 100, 120, 120)

doc.add_paragraph().paragraph_format.space_after = Pt(6)

add_heading_2("2.3 Mecanismo de Alerta PPF (Punição por Faltas)")
add_body_p(
    "Cada disciplina possui um limite máximo configurável de faltas injustificadas toleradas (por defeito, 6 faltas semestrais ou 3 em disciplinas de carga reduzida como Matemática). Cada vez que uma chamada é submetida:"
)
add_body_p(
    "1. O sistema verifica as faltas activas não justificadas acumuladas pelo aluno na referida disciplina.\n"
    "2. Caso o total iguale ou supere o limite_ppf, o sistema cria automaticamente um registo de PPF com estado 'ABERTO'.\n"
    "3. O sistema gera uma notificação prioritária com texto urgente dirigida ao encarregado, solicitando comparência à escola."
)

# ==========================================
# 3. LEVANTAMENTO E ESPECIFICAÇÃO DE REQUISITOS
# ==========================================
add_heading_1("3. Levantamento e Especificação de Requisitos")

add_heading_2("3.1 Requisitos Funcionais (RF)")

rf_data = [
    ("RF01", "Autenticação e Autorização", "Permitir o login seguro de utilizadores via e-mail e palavra-passe, gerando token JWT com expiração de 8 horas e controlo RBAC.", "Todos", "Alta"),
    ("RF02", "Gestão de Turmas", "Permitir à secretaria cadastrar, editar, desativar e listar turmas (nome, ano lectivo, classe e turno: Manhã, Tarde ou Noite).", "Secretaria", "Alta"),
    ("RF03", "Gestão de Disciplinas", "Permitir à secretaria configurar disciplinas escolares com parametrização individual do limite máximo de faltas para PPF.", "Secretaria", "Alta"),
    ("RF04", "Gestão de Docentes", "Permitir o cadastro de professores, vinculando dados pessoais, credenciais de acesso, e-mail e contacto telefónico.", "Secretaria", "Alta"),
    ("RF05", "Gestão de Alunos", "Permitir cadastrar alunos com código de matrícula único, nome completo, data de nascimento e alocação na turma.", "Secretaria", "Alta"),
    ("RF06", "Gestão de Encarregados", "Permitir o registo de encarregados de educação e associação bidirecional (1:N) aos respectivos educandos.", "Secretaria", "Alta"),
    ("RF07", "Associação Académica", "Associar docentes às respectivas disciplinas e turmas (tabela associativa professor_disciplina_turma).", "Secretaria", "Alta"),
    ("RF08", "Abertura de Aula", "Permitir ao docente registar a sessão de aula com data, horário de início/término e conteúdo programático.", "Professor", "Alta"),
    ("RF09", "Realização de Chamada", "Disponibilizar interface reactiva para o docente marcar presenças e faltas por aluno e submeter a chamada da aula.", "Professor", "Alta"),
    ("RF10", "Notificação Automática por SMS", "Disparar imediatamente mensagem SMS padronizada ao encarregado quando o aluno registar falta confirmada na chamada.", "Sistema", "Alta"),
    ("RF11", "Envio em Lote de SMS", "Permitir à secretaria enviar comunicados urgentes ou gerais via SMS para múltiplos encarregados (turma inteira ou escola toda).", "Secretaria", "Média"),
    ("RF12", "Justificação de Faltas", "Permitir exclusivamente à secretaria converter falta injustificada em justificada, registando motivo e anexo comprobatório.", "Secretaria", "Alta"),
    ("RF13", "Processamento de PPF", "Verificar em tempo real o limite de faltas e abrir processo de PPF automático quando o limite for ultrapassado.", "Sistema", "Alta"),
    ("RF14", "Portal do Encarregado", "Permitir ao encarregado visualizar os educandos vinculados, taxas de assiduidade, presenças e faltas do trimestre.", "Encarregado", "Média"),
    ("RF15", "Dashboards e Indicadores", "Disponibilizar painéis analíticos com totalizadores de alunos, assiduidade global, turmas mais faltosas e histórico de avisos.", "Secretaria / Prof.", "Média")
]

tbl_rf = doc.add_table(rows=len(rf_data)+1, cols=5)
tbl_rf.alignment = WD_TABLE_ALIGNMENT.CENTER
rf_heads = ["Código", "Requisito Funcional", "Descrição Detalhada", "Ator", "Prioridade"]
for i, h in enumerate(rf_heads):
    cell = tbl_rf.cell(0, i)
    cell.paragraphs[0].add_run(h).bold = True
    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_background(cell, HEX_PRIMARY)
    set_cell_margins(cell, 120, 120, 120, 120)

for r_idx, row in enumerate(rf_data, start=1):
    for c_idx, val in enumerate(row):
        cell = tbl_rf.cell(r_idx, c_idx)
        cell.paragraphs[0].add_run(val).font.size = Pt(9.0)
        if r_idx % 2 == 1:
            set_cell_background(cell, HEX_LIGHT_ROW)
        set_cell_margins(cell, 80, 80, 100, 100)

doc.add_paragraph().paragraph_format.space_after = Pt(6)

add_heading_2("3.2 Requisitos Não Funcionais (RNF)")

rnf_data = [
    ("RNF01", "Desempenho e Tempo de Resposta", "As requisições à API REST devem responder em menos de 1,5 segundos em condições normais de rede.", "Métrica de QoS"),
    ("RNF02", "Inclusão e Acessibilidade Telefónica", "A recepção de alertas deve ser viável em telemóveis analógicos GSM (2G/3G) sem exigir smartphones nem tráfego de dados.", "Usabilidade Social"),
    ("RNF03", "Segurança e Proteção Criptográfica", "Palavras-passe armazenadas obrigatoriamente com salt e hash Bcrypt; comunicação web 100% sob protocolo HTTPS com TLS.", "Segurança"),
    ("RNF04", "Integridade e Auditoria de Dados", "Impossibilidade de alteração retroactiva de presenças por parte de professores após o encerramento oficial da chamada.", "Integridade Académica"),
    ("RNF05", "Alta Disponibilidade em Nuvem", "Arquitectura implantada em servidores globais (Vercel e Render) com base de dados distribuída e tolerante a falhas (TiDB).", "Disponibilidade"),
    ("RNF06", "Compatibilidade Cross-Device", "Interface do Frontend 100% responsiva, adaptável a computadores de secretária, tablets e ecrãs de telemóveis.", "Portabilidade"),
    ("RNF07", "Resiliência no Serviço de Mensagens", "Suporte a múltiplos modos de operação (Infobip Cloud, TextBee Android Gateway e Modo Simulação offline).", "Tolerância a Falhas"),
    ("RNF08", "Conformidade com SQL Moderno", "Consultas compatíveis com ONLY_FULL_GROUP_BY em conformidade com o padrão ANSI/ISO SQL moderno.", "Manutenibilidade"),
    ("RNF09", "Isolamento e Desacoplamento", "Arquitectura Frontend SPA desacoplada do Backend REST, permitindo evolução independente de serviços.", "Arquitetura"),
    ("RNF10", "Privacidade de Dados de Menores", "Anonimização e proteção de dados cadastrais de crianças, sem exposição de números de telefone em APIs públicas.", "Conformidade Legal")
]

tbl_rnf = doc.add_table(rows=len(rnf_data)+1, cols=4)
tbl_rnf.alignment = WD_TABLE_ALIGNMENT.CENTER
rnf_heads = ["Código", "Requisito Não Funcional", "Especificação Técnica", "Categoria"]
for i, h in enumerate(rnf_heads):
    cell = tbl_rnf.cell(0, i)
    cell.paragraphs[0].add_run(h).bold = True
    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_background(cell, HEX_PRIMARY)
    set_cell_margins(cell, 120, 120, 120, 120)

for r_idx, row in enumerate(rnf_data, start=1):
    for c_idx, val in enumerate(row):
        cell = tbl_rnf.cell(r_idx, c_idx)
        cell.paragraphs[0].add_run(val).font.size = Pt(9.0)
        if r_idx % 2 == 1:
            set_cell_background(cell, HEX_LIGHT_ROW)
        set_cell_margins(cell, 80, 80, 100, 100)

# ==========================================
# 4. MODELAÇÃO DO SISTEMA E DIAGRAMAS UML
# ==========================================
add_heading_1("4. Modelação do Sistema e Diagramas UML")

add_heading_2("4.1 Diagrama de Casos de Uso")
add_body_p(
    "O Diagrama de Casos de Uso sintetiza as interações entre os atores externos e os serviços disponibilizados na fronteira do sistema StudentControl. A Secretaria concentra a administração dos recursos escolares; o Professor actua operacionalmente no ambiente de sala de aula; o Encarregado recebe o feedback de assiduidade; e os Gateways de SMS processam os pacotes de comunicação celular."
)

add_image_with_caption(
    os.path.join(DIAGRAMS_DIR, "diagram_use_case.png"),
    "Figura 1: Diagrama de Casos de Uso da Plataforma StudentControl (UML)"
)

add_body_p("Descrição dos Relacionamentos Chave no Diagrama:")
add_body_p("• «include» entre 'Realizar Chamada' e 'Despachar Notificação SMS': O envio da mensagem não depende de acionamento manual do professor; é uma consequência obrigatória e automática da confirmação de falta.")
add_body_p("• «include» entre 'Realizar Chamada' e 'Calcular Faltas e Gerar Alerta PPF': Sempre que uma falta é registada, o motor de regras avalia se o limiar regulamentar foi atingido.")

add_heading_2("4.2 Diagrama de Actividades: Realização de Chamada e Envio de SMS")
add_body_p(
    "O diagrama a seguir descreve a lógica sequencial e as raias de responsabilidade (swimlanes) durante a execução de uma aula. O professor assinala a assiduidade, o backend valida as condições e despacha o SMS de forma transparente e imediata."
)

add_image_with_caption(
    os.path.join(DIAGRAMS_DIR, "diagram_activity_attendance.png"),
    "Figura 2: Diagrama de Actividades - Fluxo de Chamada e Notificação SMS Automática"
)

add_heading_2("4.3 Diagrama de Actividades: Processo de Justificação de Faltas")
add_body_p(
    "Para assegurar integridade académica estrita, os professores não possuem permissão para alterar faltas já chanceladas. O encarregado comparece à secretaria escolar com o documento justificativo (ex.: atestado médico ou declaração institucional). Somente a secretaria analisa e homologa a justificação no sistema."
)

add_image_with_caption(
    os.path.join(DIAGRAMS_DIR, "diagram_activity_justification.png"),
    "Figura 3: Diagrama de Actividades - Justificação de Faltas e Integridade Académica"
)

# ==========================================
# 5. ARQUITECTURA DE SOFTWARE E INFRAESTRUTURA
# ==========================================
add_heading_1("5. Arquitectura de Software e Infraestrutura Tecnológica")

add_heading_2("5.1 Arquitectura em Três Camadas Desacopladas")
add_body_p(
    "O StudentControl adota uma arquitectura multicamadas moderna, escalável e resiliente, distribuída em serviços de nuvem de alto desempenho com comunicação segura por TLS/SSL."
)

add_image_with_caption(
    os.path.join(DIAGRAMS_DIR, "diagram_architecture.png"),
    "Figura 4: Diagrama da Arquitetura Geral do Sistema StudentControl"
)

add_heading_2("5.2 Descrição dos Componentes Tecnológicos")
add_body_p(
    "1. Camada de Apresentação (Frontend SPA): Desenvolvida em React 19 empacotado com Vite 7. Oferece carregamento instantâneo, roteamento declarativo e renderização optimizada de componentes com design responsivo. Hospedada na Vercel com distribuição global via Edge CDN e certificados SSL automáticos."
)
add_body_p(
    "2. Camada de Negócio e Serviços (Backend REST API): Desenvolvida em Node.js com Express 5. Implementa middleware de autenticação JWT, validação rigorosa de entradas, tratamento global de erros e orquestrador de mensagens assíncronas. Hospedada na plataforma Render em contentor seguro."
)
add_body_p(
    "3. Camada de Persistência (TiDB Cloud Serverless): Base de dados relacional distribuída compatível com protocolo MySQL 8.0. Fornece alta disponibilidade nativa, tolerância a desastres, cópias de segurança contínuas e encriptação em repouso e trânsito."
)
add_body_p(
    "4. Camada de Telecomunicações (Gateway Híbrido de SMS): O sistema suporta dois motores intercambiáveis por configuração (.env):",
    bold_prefix="Inovação no Envio Celular: "
)
add_body_p("• Opção A (Infobip Cloud API): Gateway empresarial internacional com entregas em redes globais via HTTP POST.")
add_body_p("• Opção B (TextBee Android Gateway): Solução de baixo custo e alta pertinência local moçambicana. Conecta um smartphone Android equipado com cartão SIM da Movitel ou Vodacom (com pacote diário de SMS contratado) directamente à API do StudentControl, transformando o telemóvel num gateway institucional local.")

# ==========================================
# 6. MODELAÇÃO DA BASE DE DADOS (DER)
# ==========================================
add_heading_1("6. Modelação da Base de Dados")

add_heading_2("6.1 Diagrama Entidade-Relacionamento Lógico (DER)")
add_body_p(
    "A base de dados foi normalizada até à 3ª Forma Normal (3FN), garantindo integridade referencial, eliminação de redundâncias e alta velocidade em consultas analíticas de assiduidade."
)

add_image_with_caption(
    os.path.join(DIAGRAMS_DIR, "diagram_er.png"),
    "Figura 5: Diagrama Entidade-Relacionamento Lógico (DER) - 13 Tabelas"
)

add_heading_2("6.2 Dicionário de Dados e Estrutura das Tabelas")

tables_summary = [
    ("usuarios", "Armazena credenciais e perfis de acesso ao sistema.", "id, nome, email, password_hash, perfil ('SECRETARIA', 'PROFESSOR', 'ENCARREGADO'), activo, criado_em"),
    ("turmas", "Registo das turmas lectivas da escola.", "id, nome, ano_lectivo, classe, turno ('Manha', 'Tarde', 'Noite'), activo, criado_em"),
    ("disciplinas", "Registo curricular e limite de faltas.", "id, nome, limite_ppf, activo, criado_em"),
    ("professores", "Dados cadastrais e profissionais dos docentes.", "id, usuario_id (FK), nome, email, telefone, activo, criado_em"),
    ("encarregados", "Contactos dos pais e responsáveis pelos alunos.", "id, usuario_id (FK), nome, telefone, email, parentesco, activo, criado_em"),
    ("alunos", "Ficha escolar do estudante e turma activa.", "id, nome, numero_aluno, data_nascimento, turma_id (FK), activo, criado_em"),
    ("aluno_encarregado", "Associação cardinal N:M entre estudantes e encarregados.", "aluno_id (PK, FK), encarregado_id (PK, FK)"),
    ("prof_disc_turma", "Alocação do professor às disciplinas das suas turmas.", "id, professor_id (FK), disciplina_id (FK), turma_id (FK), activo, criado_em"),
    ("aulas", "Sessões de aula diárias agendadas ou realizadas.", "id, professor_id (FK), disciplina_id (FK), turma_id (FK), data_aula, hora_inicio, hora_fim, estado"),
    ("presencas", "Registo individual da chamada por aluno.", "id, aula_id (FK), aluno_id (FK), estado ('PRESENTE', 'FALTA'), justificada, marcada_por (FK)"),
    ("justificacoes", "Auditoria de anulação de faltas com comprovativos.", "id, presenca_id (FK), justificado_por (FK), motivo, documento_anexo, observacao"),
    ("notificacoes", "Histórico de auditoria de SMS disparados.", "id, encarregado_id (FK), tipo ('FALTA', 'PPF'), destinatario, mensagem, estado ('PENDENTE', 'ENVIADO', 'FALHOU')"),
    ("ppf", "Processos disciplinares de Punição por Faltas.", "id, aluno_id (FK), disciplina_id (FK), faltas_nao_justificadas, estado ('ABERTO', 'NOTIFICADO', 'RESOLVIDO')")
]

tbl_dic = doc.add_table(rows=len(tables_summary)+1, cols=3)
tbl_dic.alignment = WD_TABLE_ALIGNMENT.CENTER
dic_heads = ["Tabela", "Finalidade no Sistema", "Campos Principais"]
for i, h in enumerate(dic_heads):
    cell = tbl_dic.cell(0, i)
    cell.paragraphs[0].add_run(h).bold = True
    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_background(cell, HEX_PRIMARY)
    set_cell_margins(cell, 120, 120, 120, 120)

for r_idx, row in enumerate(tables_summary, start=1):
    for c_idx, val in enumerate(row):
        cell = tbl_dic.cell(r_idx, c_idx)
        cell.paragraphs[0].add_run(val).font.size = Pt(8.8)
        if r_idx % 2 == 1:
            set_cell_background(cell, HEX_LIGHT_ROW)
        set_cell_margins(cell, 80, 80, 100, 100)

# ==========================================
# 7. MODELOS DE MENSAGENS E TELECOMUNICAÇÕES
# ==========================================
add_heading_1("7. Especificação das Notificações SMS")
add_body_p(
    "Para assegurar clareza, sobriedade institucional e cumprimento do limite padrão de 160 caracteres por SMS, o StudentControl emprega modelos dinâmicos com interpolação de variáveis contextuais:"
)

add_body_p(
    "Estimado(a) Sr(a). {encarregado}, informamos que o(a) estudante {aluno} registou FALTA na aula de {disciplina} (Turma {turma}) no dia {data}. StudentControl",
    bold_prefix="1. Notificação de Falta Escolar (FALTA): "
)

add_body_p(
    "URGENTE: Estimado(a) Sr(a). {encarregado}, o(a) estudante {aluno} atingiu o limite de {faltas} faltas não justificadas na disciplina de {disciplina} (PPF). Compareça à secretaria da escola. StudentControl",
    bold_prefix="2. Alerta de Limite Regulamentar (PPF): "
)

add_body_p(
    "Estimado(a) Sr(a). {encarregado}, {mensagem}. StudentControl",
    bold_prefix="3. Comunicado em Lote (Broadcast Geral): "
)

# ==========================================
# 8. PROCEDIMENTOS DE IMPLANTAÇÃO E CI/CD
# ==========================================
add_heading_1("8. Implantação Contínua e Operação em Nuvem")
add_body_p(
    "O ciclo de engenharia do StudentControl implementa um pipeline de Integração e Entrega Contínua (CI/CD) vinculado ao repositório GitHub (https://github.com/pCom33/StudentControl):"
)
add_body_p("• Cada actualização no ramo 'main' dispara automaticamente a compilação do Vite na Vercel.")
add_body_p("• O contentor do Render efectua pull automático, instala dependências e executa o servidor Node.js.")
add_body_p("• O ficheiro de configuração frontend/.env.production garante que o website consulte em tempo real a API de produção na nuvem.")

# ==========================================
# 9. CONSIDERAÇÕES FINAIS E TRABALHOS FUTUROS
# ==========================================
add_heading_1("9. Considerações Finais")
add_body_p(
    "O desenvolvimento do StudentControl comprova que a investigação científica universitária tem a capacidade concreta de resolver problemas sociais endémicos da educação básica através da inovação de software."
)
add_body_p(
    "Ao aliar a integridade académica (auditoria rigorosa, rastreabilidade e cumprimento automático das normas de faltas) à inclusão tecnológica (notificações por SMS acessíveis a qualquer família sem requerer internet), o projecto estabelece uma ponte sólida entre a escola, a universidade e a sociedade."
)
add_body_p(
    "Como linhas de desenvolvimento futuro para a versão StudentControl 2.0, perspectivam-se: (1) Módulo Progressive Web App (PWA) para funcionamento offline de chamada em escolas sem conectividade fixa; (2) Leitor biométrico de baixo custo acoplado para escolas de grande dimensão; e (3) Módulo de Inteligência Artificial para análise preditiva e identificação precoce de perfis de risco de evasão escolar.",
    bold_prefix="Trabalhos Futuros: "
)

# Salvar documento
os.makedirs(os.path.dirname(DOCX_OUTPUT_PATH), exist_ok=True)
doc.save(DOCX_OUTPUT_PATH)
print("Documento salvo com sucesso em:", DOCX_OUTPUT_PATH)

# Salvar também no diretório de artefatos
os.makedirs(os.path.dirname(ARTIFACT_OUTPUT_PATH), exist_ok=True)
doc.save(ARTIFACT_OUTPUT_PATH)
print("Cópia salva com sucesso no diretório de artefatos:", ARTIFACT_OUTPUT_PATH)
