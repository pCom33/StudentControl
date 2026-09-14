import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { apiRequest, createResource, deleteResource, getResource, login, updateResource } from './api.js';
import Logo from './Logo.jsx';
import './styles.css';

const iconPaths = {
  dashboard: [
    <rect key="d1" x="3" y="3" width="7" height="9" rx="1" />,
    <rect key="d2" x="14" y="3" width="7" height="5" rx="1" />,
    <rect key="d3" x="14" y="12" width="7" height="9" rx="1" />,
    <rect key="d4" x="3" y="16" width="7" height="5" rx="1" />
  ],
  students: [
    <path key="s1" d="M22 10v6M2 10l10-5 10 5-10 5z" />,
    <path key="s2" d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  ],
  teachers: [
    <rect key="t1" x="2" y="7" width="20" height="14" rx="2" ry="2" />,
    <path key="t2" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  ],
  guardians: [
    <path key="g1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />,
    <circle key="g2" cx="9" cy="7" r="4" />,
    <path key="g3" d="M22 21v-2a4 4 0 0 0-3-3.87" />,
    <path key="g4" d="M16 3.13a4 4 0 0 1 0 7.75" />
  ],
  classes: [
    <path key="c1" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  ],
  subjects: [
    <path key="sub1" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
    <path key="sub2" d="M8 7h6" />,
    <path key="sub3" d="M8 11h8" />
  ],
  associations: [
    <path key="a1" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />,
    <path key="a2" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  ],
  lessons: [
    <rect key="l1" x="3" y="4" width="18" height="18" rx="2" ry="2" />,
    <line key="l2" x1="16" y1="2" x2="16" y2="6" />,
    <line key="l3" x1="8" y1="2" x2="8" y2="6" />,
    <line key="l4" x1="3" y1="10" x2="21" y2="10" />,
    <circle key="l5" cx="12" cy="15" r="2" />
  ],
  attendance: [
    <rect key="at1" x="8" y="2" width="8" height="4" rx="1" ry="1" />,
    <path key="at2" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />,
    <path key="at3" d="m9 14 2 2 4-4" />
  ],
  alerts: [
    <path key="al1" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />,
    <line key="al2" x1="12" y1="9" x2="12" y2="13" />,
    <line key="al3" x1="12" y1="17" x2="12.01" y2="17" />
  ],
  notifications: [
    <path key="n1" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />,
    <path key="n2" d="M13.73 21a2 2 0 0 1-3.46 0" />
  ],
  user: [
    <path key="u1" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />,
    <circle key="u2" cx="12" cy="7" r="4" />
  ],
  menu: [
    <line key="m1" x1="3" y1="12" x2="21" y2="12" />,
    <line key="m2" x1="3" y1="6" x2="21" y2="6" />,
    <line key="m3" x1="3" y1="18" x2="21" y2="18" />
  ],
  search: [
    <circle key="s1" cx="11" cy="11" r="8" />,
    <line key="s2" x1="21" y1="21" x2="16.65" y2="16.65" />
  ],
  lock: [
    <rect key="lk1" x="3" y="11" width="18" height="11" rx="2" ry="2" />,
    <path key="lk2" d="M7 11V7a5 5 0 0 1 10 0v4" />
  ],
  mail: [
    <rect key="ml1" x="2" y="4" width="20" height="16" rx="2" />,
    <path key="ml2" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  ],
  add: [
    <line key="ad1" x1="12" y1="5" x2="12" y2="19" />,
    <line key="ad2" x1="5" y1="12" x2="19" y2="12" />
  ],
  more: [
    <circle key="mr1" cx="12" cy="12" r="1" />,
    <circle key="mr2" cx="19" cy="12" r="1" />,
    <circle key="mr3" cx="5" cy="12" r="1" />
  ],
  back: [
    <line key="bk1" x1="19" y1="12" x2="5" y2="12" />,
    <polyline key="bk2" points="12 19 5 12 12 5" />
  ],
  calendar: [
    <rect key="c1" x="3" y="4" width="18" height="18" rx="2" ry="2" />,
    <line key="c2" x1="16" y1="2" x2="16" y2="6" />,
    <line key="c3" x1="8" y1="2" x2="8" y2="6" />,
    <line key="c4" x1="3" y1="10" x2="21" y2="10" />
  ],
  bell: [
    <path key="bl1" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />,
    <path key="bl2" d="M13.73 21a2 2 0 0 1-3.46 0" />
  ],
  phone: [
    <path key="ph1" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ],
  check: [
    <polyline key="chk1" points="20 6 9 17 4 12" />
  ],
  trash: [
    <polyline key="tr1" points="3 6 5 6 21 6" />,
    <path key="tr2" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    <line key="tr3" x1="10" y1="11" x2="10" y2="17" />,
    <line key="tr4" x1="14" y1="11" x2="14" y2="17" />
  ],
  edit: [
    <path key="ed1" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />,
    <path key="ed2" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  ],
  'log-out': [
    <path key="lo1" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />,
    <polyline key="lo2" points="16 17 21 12 16 7" />,
    <line key="lo3" x1="21" y1="12" x2="9" y2="12" />
  ]
};

const navByRole = {
  SECRETARIA: [
    ['dashboard', 'Dashboard'],
    ['students', 'Alunos'],
    ['guardians', 'Encarregados'],
    ['teachers', 'Professores'],
    ['classes', 'Turmas'],
    ['subjects', 'Disciplinas'],
    ['associations', 'Associações'],
    ['lessons', 'Aulas'],
    ['attendance', 'Faltas'],
    ['alerts', 'PPF'],
    ['notifications', 'Notificações']
  ],
  PROFESSOR: [
    ['teacher-dashboard', 'Dashboard'],
    ['call', 'Fazer chamada']
  ],
  ENCARREGADO: [
    ['guardian-dashboard', 'Dashboard'],
    ['notifications', 'Avisos']
  ]
};

function Icon({ name, alt = '', size = 18, className = '' }) {
  const elements = iconPaths[name] || iconPaths.user;
  return (
    <svg className={`icon ${className}`} aria-label={alt} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {elements}
    </svg>
  );
}

function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [menuExpanded, setMenuExpanded] = useState(() => localStorage.getItem('studentcontrol_menu') !== 'collapsed');

  function afterLogin(nextUser) {
    setUser(nextUser);
    setScreen(nextUser.perfil === 'PROFESSOR' ? 'teacher-dashboard' : nextUser.perfil === 'ENCARREGADO' ? 'guardian-dashboard' : 'dashboard');
  }

  function logout() {
    localStorage.removeItem('studentcontrol_token');
    setUser(null);
    setScreen('login');
  }

  const title = useMemo(() => {
    const labels = Object.values(navByRole).flat();
    if (screen === 'new-student') return 'Novo aluno';
    if (screen === 'new-teacher') return 'Novo professor';
    if (screen === 'new-guardian') return 'Novo encarregado';
    if (screen === 'new-class') return 'Nova turma';
    if (screen === 'new-subject') return 'Nova disciplina';
    if (screen === 'student-profile') return 'Perfil do aluno';
    if (screen === 'class-detail') return 'Detalhes da turma';
    return labels.find(([key]) => key === screen)?.[1] || 'Dashboard';
  }, [screen]);

  if (!user) return <Login onLogin={afterLogin} />;

  return (
    <div className={`app-shell ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Sidebar active={screen} setScreen={setScreen} user={user} onLogout={logout} expanded={menuExpanded} onToggle={() => {
        setMenuExpanded((current) => {
          localStorage.setItem('studentcontrol_menu', current ? 'collapsed' : 'expanded');
          return !current;
        });
      }} />
      <main className="workspace">
        <Topbar title={title} user={user} onLogout={logout} />
        <div className="content">
          <ScreenRouter screen={screen} setScreen={setScreen} user={user} refreshKey={refreshKey} refresh={() => setRefreshKey((key) => key + 1)} />
        </div>
      </main>
    </div>
  );
}

function ScreenRouter({ screen, setScreen, user, refreshKey, refresh }) {
  const [selected, setSelected] = useState(null);
  const props = { setScreen, setSelected, selected, refreshKey, refresh };

  if (screen === 'dashboard') return <SecretaryDashboard setScreen={setScreen} refreshKey={refreshKey} />;
  if (screen === 'teacher-dashboard') return <TeacherDashboard setScreen={setScreen} user={user} refreshKey={refreshKey} />;
  if (screen === 'guardian-dashboard') return <GuardianDashboard refreshKey={refreshKey} />;
  if (screen === 'students') return <ResourceList {...props} resource="alunos" title="Alunos" addScreen="new-student" columns={studentColumns} detailScreen="student-profile" />;
  if (screen === 'teachers') return <ResourceList {...props} resource="professores" title="Professores" addScreen="new-teacher" columns={teacherColumns} />;
  if (screen === 'guardians') return <ResourceList {...props} resource="encarregados" title="Encarregados de Educação" addScreen="new-guardian" columns={guardianColumns} />;
  if (screen === 'classes') return <ResourceList {...props} resource="turmas" title="Turmas" addScreen="new-class" columns={classColumns} detailScreen="class-detail" />;
  if (screen === 'subjects') return <ResourceList {...props} resource="disciplinas" title="Disciplinas" addScreen="new-subject" columns={subjectColumns} />;
  if (screen === 'associations') return <Associations refreshKey={refreshKey} refresh={refresh} />;
  if (screen === 'lessons') return <Lessons refreshKey={refreshKey} refresh={refresh} />;
  if (screen === 'attendance') return <Absences refreshKey={refreshKey} refresh={refresh} />;
  if (screen === 'alerts') return <Ppf refreshKey={refreshKey} />;
  if (screen === 'notifications') return <Notifications refreshKey={refreshKey} />;
  if (screen === 'new-student') return <StudentForm setScreen={setScreen} refresh={refresh} />;
  if (screen === 'new-teacher') return <TeacherForm setScreen={setScreen} refresh={refresh} />;
  if (screen === 'new-guardian') return <GuardianForm setScreen={setScreen} refresh={refresh} />;
  if (screen === 'new-class') return <ClassForm setScreen={setScreen} refresh={refresh} />;
  if (screen === 'new-subject') return <SubjectForm setScreen={setScreen} refresh={refresh} />;
  if (screen === 'student-profile') return <StudentProfile selected={selected} setScreen={setScreen} />;
  if (screen === 'class-detail') return <ClassDetail selected={selected} setScreen={setScreen} />;
  if (screen === 'call') return <AttendanceCall user={user} refresh={refresh} />;
  return <SecretaryDashboard setScreen={setScreen} refreshKey={refreshKey} />;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('secretaria@escola.co.mz');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const result = await login(email, password);
      localStorage.setItem('studentcontrol_token', result.token);
      onLogin(result.user);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div className="login-logo-container">
          <Logo size={42} />
        </div>
        <p className="login-subtitle">Iniciar sessão para aceder ao sistema</p>
        <label>Email</label>
        <div className="input-icon"><Icon name="mail" /><input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
        <label>Palavra-passe</label>
        <div className="input-icon"><Icon name="lock" /><input type={showPassword ? 'text' : 'password'} required minLength="6" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <label className="check"><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Mostrar palavra-passe</label>
        {message && <div className="alert">{message}</div>}
        <button className="btn primary" type="submit">Entrar</button>
        <a>Esqueceu a palavra-passe?</a>
      </form>
    </main>
  );
}

function Sidebar({ active, setScreen, user, onLogout, expanded, onToggle }) {
  const items = navByRole[user.perfil] || navByRole.SECRETARIA;
  return (
    <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <button className="menu-button" type="button" title={expanded ? 'Ocultar nomes' : 'Mostrar nomes'} aria-label={expanded ? 'Ocultar nomes do menu' : 'Mostrar nomes do menu'} onClick={onToggle}>
        <Icon name="menu" />
        <span className="nav-label">Menu</span>
      </button>
      <div className="side-logo-wrap">
        <Logo size={expanded ? 28 : 32} variant={expanded ? 'full' : 'mark'} />
      </div>
      <nav>
        {items.map(([key, label]) => (
          <button key={key} title={label} className={active === key ? 'active' : ''} onClick={() => setScreen(key)}>
            <Icon name={iconName(key)} alt={label} />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>
      <button className="avatar-button" title="Sair" onClick={onLogout}>
        <Icon name="log-out" />
        <span className="nav-label">Sair</span>
      </button>
    </aside>
  );
}

function Topbar({ title, user, onLogout }) {
  return (
    <header className="topbar">
      <div className="search"><Icon name="search" /><input placeholder="Pesquisar..." readOnly /></div>
      <div className="top-actions">
        <span>{title}</span>
        <span>{user.nome}</span>
        <button className="icon-button"><Icon name="bell" /></button>
        <button className="btn secondary compact" onClick={onLogout}>Sair</button>
      </div>
    </header>
  );
}

const studentColumns = [
  ['numero_aluno', 'Numero'],
  ['nome', 'Nome'],
  ['turma', 'Turma'],
  ['encarregado', 'Encarregado'],
  ['estado', 'Estado']
];
const teacherColumns = [['nome', 'Nome'], ['email', 'Email'], ['telefone', 'Telefone'], ['estado', 'Estado']];
const guardianColumns = [['nome', 'Nome'], ['telefone', 'Telefone'], ['educando', 'Educando'], ['parentesco', 'Parentesco'], ['estado', 'Estado']];
const classColumns = [['nome', 'Nome da turma'], ['numero_alunos', 'Numero de alunos'], ['turno', 'Turno'], ['estado', 'Estado']];
const subjectColumns = [['nome', 'Disciplina'], ['limite_ppf', 'Limite PPF'], ['estado', 'Estado']];

function ResourceList({ resource, title, addScreen, columns, detailScreen, setScreen, setSelected, refreshKey, refresh }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, [resource, refreshKey]);

  async function load() {
    try {
      const data = await getResource(`/ ${resource}`.replace(' ', ''));
      setRows(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(row) {
    if (!window.confirm('Pretende desactivar este registo?')) return;
    try {
      const result = await deleteResource(`/${resource}/${row.id}`);
      setMessage(result.message);
      refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="data-page">
      <Toolbar title={title} add={() => setScreen(addScreen)} search={search} setSearch={setSearch} />
      {message && <div className="notice">{message}</div>}
      <DataTable
        rows={filtered}
        columns={columns}
        onOpen={detailScreen ? (row) => {
          setSelected(row);
          setScreen(detailScreen);
        } : undefined}
        onDelete={['alunos', 'professores', 'encarregados'].includes(resource) ? remove : undefined}
      />
    </section>
  );
}

function Toolbar({ title, add, search, setSearch }) {
  return (
    <div className="toolbar">
      <div>
        <h2>{title}</h2>
        <div className="filters">
          <input placeholder="Pesquisar..." value={search || ''} onChange={(event) => setSearch?.(event.target.value)} />
          <select><option>Estado: Todos</option></select>
        </div>
      </div>
      {add && <button className="btn primary icon-text" onClick={add}><Icon name="add" />Novo</button>}
    </div>
  );
}

function DataTable({ rows, columns, onOpen, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th></th>{columns.map(([, label]) => <th key={label}>{label}</th>)}<th>Accoes</th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={columns.length + 2}>Nenhum registo encontrado.</td></tr>}
          {rows.map((row) => (
            <tr key={row.id}>
              <td><input type="checkbox" /></td>
              {columns.map(([key]) => (
                <td key={key}>
                  {key === 'nome' && onOpen ? <button className="link-cell" onClick={() => onOpen(row)}><Icon name="user" />{row[key]}</button> : formatCell(row[key])}
                </td>
              ))}
              <td className="actions-cell">
                {onOpen && <button className="btn secondary compact" onClick={() => onOpen(row)}>Abrir</button>}
                {onDelete && <button className="btn secondary compact" onClick={() => onDelete(row)}>Desactivar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">1</div>
    </div>
  );
}

function SecretaryDashboard({ setScreen, refreshKey }) {
  const [data, setData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    getResource('/dashboard/secretaria').then(setData).catch((error) => setMessage(error.message));
  }, [refreshKey]);

  return (
    <section className="page-grid">
      {message && <div className="notice full">{message}</div>}
      <div className="stats">
        <Metric icon="students" label="Alunos" value={data.alunos ?? 0} tone="green" />
        <Metric icon="teachers" label="Professores" value={data.professores ?? 0} tone="blue" />
        <Metric icon="classes" label="Turmas" value={data.turmas ?? 0} tone="amber" />
        <Metric icon="attendance" label="Faltas hoje" value={data.faltasHoje ?? 0} tone="coral" />
        <Metric icon="alerts" label="Faltas nao justificadas" value={data.faltasNaoJustificadas ?? 0} tone="amber" />
        <Metric icon="alerts" label="Alunos com PPF" value={data.ppf ?? 0} tone="coral" />
      </div>
      <div className="chart-panel wide"><PanelTitle title="Actividade recente" /><div className="bar-chart">{[45, 38, 52, 33, 24, 27, 44, 51, 41].map((v) => <span key={v} style={{ height: `${v + 28}px` }} />)}</div></div>
      <div className="chart-panel"><PanelTitle title="Faltas" /><div className="donut"><span>{data.faltasNaoJustificadas ?? 0}</span></div></div>
      <div className="chart-panel wide">
        <PanelTitle title="Acesso rapido" />
        <div className="quick-actions">
          <button onClick={() => setScreen('new-student')}>Novo aluno</button>
          <button onClick={() => setScreen('new-teacher')}>Novo professor</button>
          <button onClick={() => setScreen('new-class')}>Nova turma</button>
          <button onClick={() => setScreen('lessons')}>Criar aula</button>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value, tone }) {
  return <article className="metric"><div className={`metric-icon ${tone}`}><Icon name={icon} /></div><div><strong>{value}</strong><span>{label}</span></div></article>;
}

function StudentForm({ setScreen, refresh }) {
  const [refs, setRefs] = useState({ turmas: [], encarregados: [] });
  const [form, setForm] = useState({ nome: '', numero_aluno: '', data_nascimento: '', turma_id: '', encarregado_id: '', activo: 1 });
  useEffect(() => { Promise.all([getResource('/turmas'), getResource('/encarregados')]).then(([turmas, encarregados]) => setRefs({ turmas, encarregados })); }, []);
  return (
    <ApiForm title="Novo aluno" submit="Guardar aluno" back="students" setScreen={setScreen} refresh={refresh} path="/alunos" form={form} setForm={setForm}>
      <input placeholder="Nome completo *" required minLength="2" maxLength="160" value={form.nome} onChange={bind(setForm, 'nome')} />
      <input placeholder="Numero de aluno *" required maxLength="60" value={form.numero_aluno} onChange={bind(setForm, 'numero_aluno')} />
      <input type="date" max={new Date().toISOString().slice(0, 10)} value={form.data_nascimento} onChange={bind(setForm, 'data_nascimento')} />
      <select value={form.turma_id} onChange={bind(setForm, 'turma_id')}><option value="">Turma</option>{refs.turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select>
      <select value={form.encarregado_id} onChange={bind(setForm, 'encarregado_id')}><option value="">Encarregado</option>{refs.encarregados.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}</select>
      <select value={form.activo} onChange={bind(setForm, 'activo')}><option value="1">Activo</option><option value="0">Inactivo</option></select>
    </ApiForm>
  );
}

function TeacherForm({ setScreen, refresh }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', password: '123456', activo: 1 });
  return (
    <ApiForm title="Novo professor" submit="Guardar professor" back="teachers" setScreen={setScreen} refresh={refresh} path="/professores" form={form} setForm={setForm}>
      <input placeholder="Nome completo *" required minLength="2" maxLength="160" value={form.nome} onChange={bind(setForm, 'nome')} />
      <input type="email" placeholder="Email *" required maxLength="160" value={form.email} onChange={bind(setForm, 'email')} />
      <input type="tel" placeholder="Telefone (+258...)" pattern="(?:\\+?258)?8[2-7][0-9]{7}" value={form.telefone} onChange={bind(setForm, 'telefone')} />
      <input type="password" placeholder="Palavra-passe inicial *" required minLength="6" value={form.password} onChange={bind(setForm, 'password')} />
      <select value={form.activo} onChange={bind(setForm, 'activo')}><option value="1">Activo</option><option value="0">Inactivo</option></select>
    </ApiForm>
  );
}

function GuardianForm({ setScreen, refresh }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ nome: '', telefone: '+258876386514', email: '', parentesco: '', aluno_id: '', activo: 1 });
  useEffect(() => { getResource('/alunos').then(setStudents); }, []);
  return (
    <ApiForm title="Novo encarregado" submit="Guardar encarregado" back="guardians" setScreen={setScreen} refresh={refresh} path="/encarregados" form={form} setForm={setForm}>
      <input placeholder="Nome completo *" required minLength="2" maxLength="160" value={form.nome} onChange={bind(setForm, 'nome')} />
      <input type="tel" placeholder="Telefone para notificacoes *" required pattern="(?:\\+?258)?8[2-7][0-9]{7}" value={form.telefone} onChange={bind(setForm, 'telefone')} />
      <input type="email" placeholder="Email" maxLength="160" value={form.email} onChange={bind(setForm, 'email')} />
      <input placeholder="Parentesco" value={form.parentesco} onChange={bind(setForm, 'parentesco')} />
      <select value={form.aluno_id} onChange={bind(setForm, 'aluno_id')}><option value="">Educando</option>{students.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</select>
      <select value={form.activo} onChange={bind(setForm, 'activo')}><option value="1">Activo</option><option value="0">Inactivo</option></select>
    </ApiForm>
  );
}

function ClassForm({ setScreen, refresh }) {
  const [form, setForm] = useState({ nome: '', ano_lectivo: '2026', classe: '', turno: 'Manha', activo: 1 });
  return (
    <ApiForm title="Nova turma" submit="Guardar turma" back="classes" setScreen={setScreen} refresh={refresh} path="/turmas" form={form} setForm={setForm}>
      <input placeholder="Nome da turma *" required maxLength="80" value={form.nome} onChange={bind(setForm, 'nome')} />
      <input type="number" min="2000" max="2100" placeholder="Ano lectivo *" required value={form.ano_lectivo} onChange={bind(setForm, 'ano_lectivo')} />
      <input placeholder="Classe *" required maxLength="40" value={form.classe} onChange={bind(setForm, 'classe')} />
      <select value={form.turno} onChange={bind(setForm, 'turno')}><option>Manha</option><option>Tarde</option><option>Noite</option></select>
    </ApiForm>
  );
}

function SubjectForm({ setScreen, refresh }) {
  const [form, setForm] = useState({ nome: '', limite_ppf: 6, activo: 1 });
  return (
    <ApiForm title="Nova disciplina" submit="Guardar disciplina" back="subjects" setScreen={setScreen} refresh={refresh} path="/disciplinas" form={form} setForm={setForm}>
      <input placeholder="Nome *" required maxLength="120" value={form.nome} onChange={bind(setForm, 'nome')} />
      <input type="number" min="1" max="100" required placeholder="Limite PPF" value={form.limite_ppf} onChange={bind(setForm, 'limite_ppf')} />
      <select value={form.activo} onChange={bind(setForm, 'activo')}><option value="1">Activo</option><option value="0">Inactivo</option></select>
    </ApiForm>
  );
}

function ApiForm({ title, children, submit, back, setScreen, refresh, path, form }) {
  const [message, setMessage] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const result = await createResource(path, form);
      setMessage(result.message || 'Alteracoes guardadas com sucesso.');
      refresh();
      setTimeout(() => setScreen(back), 500);
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <form className="form-page" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {message && <div className="notice">{message}</div>}
      <div className="form-grid">{children}</div>
      <div className="form-actions">
        <button className="btn secondary" type="button" onClick={() => setScreen(back)}>Cancelar</button>
        <button className="btn primary" type="submit">{submit}</button>
      </div>
    </form>
  );
}

function Associations({ refreshKey, refresh }) {
  const [refs, setRefs] = useState({ professores: [], disciplinas: [], turmas: [], rows: [] });
  const [form, setForm] = useState({ professor_id: '', disciplina_id: '', turma_id: '' });
  const [message, setMessage] = useState('');
  useEffect(() => { load(); }, [refreshKey]);
  async function load() {
    const [professores, disciplinas, turmas, rows] = await Promise.all([getResource('/professores'), getResource('/disciplinas'), getResource('/turmas'), getResource('/associacoes')]);
    setRefs({ professores, disciplinas, turmas, rows });
  }
  async function submit(event) {
    event.preventDefault();
    try {
      const result = await createResource('/associacoes', form);
      setMessage(result.message);
      refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="data-page">
      <form className="form-page compact-form" onSubmit={submit}>
        <h2>Associacao Academica</h2>
        {message && <div className="notice">{message}</div>}
        <div className="form-grid">
          <select required value={form.professor_id} onChange={bind(setForm, 'professor_id')}><option value="">Professor *</option>{refs.professores.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
          <select required value={form.disciplina_id} onChange={bind(setForm, 'disciplina_id')}><option value="">Disciplina *</option>{refs.disciplinas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
          <select required value={form.turma_id} onChange={bind(setForm, 'turma_id')}><option value="">Turma *</option>{refs.turmas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
        </div>
        <div className="form-actions"><button className="btn primary">Criar associacao</button></div>
      </form>
      <DataTable rows={refs.rows} columns={[['professor', 'Professor'], ['disciplina', 'Disciplina'], ['turma', 'Turma']]} />
    </section>
  );
}

function Lessons({ refreshKey, refresh }) {
  const [refs, setRefs] = useState({ professores: [], disciplinas: [], turmas: [], rows: [] });
  const [form, setForm] = useState({ professor_id: '', disciplina_id: '', turma_id: '', data_aula: new Date().toISOString().slice(0, 10), hora_inicio: '07:30', hora_fim: '08:15' });
  const [message, setMessage] = useState('');
  useEffect(() => { load(); }, [refreshKey]);
  async function load() {
    const [professores, disciplinas, turmas, rows] = await Promise.all([getResource('/professores'), getResource('/disciplinas'), getResource('/turmas'), getResource('/aulas')]);
    setRefs({ professores, disciplinas, turmas, rows });
  }
  async function submit(event) {
    event.preventDefault();
    try {
      const result = await createResource('/aulas', form);
      setMessage(result.message);
      refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="data-page">
      <form className="form-page compact-form" onSubmit={submit}>
        <h2>Aulas</h2>
        {message && <div className="notice">{message}</div>}
        <div className="form-grid">
          <select required value={form.professor_id} onChange={bind(setForm, 'professor_id')}><option value="">Professor *</option>{refs.professores.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
          <select required value={form.disciplina_id} onChange={bind(setForm, 'disciplina_id')}><option value="">Disciplina *</option>{refs.disciplinas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
          <select required value={form.turma_id} onChange={bind(setForm, 'turma_id')}><option value="">Turma *</option>{refs.turmas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
          <input type="date" required value={form.data_aula} onChange={bind(setForm, 'data_aula')} />
          <input type="time" required value={form.hora_inicio} onChange={bind(setForm, 'hora_inicio')} />
          <input type="time" required value={form.hora_fim} onChange={bind(setForm, 'hora_fim')} />
        </div>
        <div className="form-actions"><button className="btn primary">Guardar aula</button></div>
      </form>
      <DataTable rows={refs.rows} columns={[['professor', 'Professor'], ['disciplina', 'Disciplina'], ['turma', 'Turma'], ['data_aula', 'Data'], ['estado', 'Estado']]} />
    </section>
  );
}

function TeacherDashboard({ setScreen, user, refreshKey }) {
  const [data, setData] = useState({ aulasHoje: [] });
  useEffect(() => { getResource('/dashboard/professor').then(setData).catch(() => setData({ aulasHoje: [] })); }, [refreshKey]);
  return (
    <section className="data-page">
      <h2>Bom dia, {user.nome}</h2>
      <p className="muted">Aqui estao as suas actividades de hoje.</p>
      <DataTable rows={data.aulasHoje} columns={[['disciplina', 'Disciplina'], ['turma', 'Turma'], ['data_aula', 'Data'], ['estado', 'Estado']]} />
      <div className="form-actions"><button className="btn primary" onClick={() => setScreen('call')}>Fazer chamada</button></div>
    </section>
  );
}

function AttendanceCall({ user, refresh }) {
  const [aulas, setAulas] = useState([]);
  const [aulaId, setAulaId] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [marks, setMarks] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const path = user.perfil === 'PROFESSOR' ? '/dashboard/professor' : '/aulas';
    getResource(path).then((data) => {
      const rows = Array.isArray(data) ? data : data.aulasHoje || [];
      setAulas(rows.filter((aula) => aula.estado === 'ABERTA'));
    });
  }, [user.perfil]);
  useEffect(() => {
    if (!aulaId) return;
    getResource(`/aulas/${aulaId}/alunos`).then((data) => {
      setAlunos(data);
      setMarks(Object.fromEntries(data.map((aluno) => [aluno.id, 'PRESENTE'])));
    });
  }, [aulaId]);

  async function submit() {
    try {
      const presencas = alunos.map((aluno) => ({ aluno_id: aluno.id, estado: marks[aluno.id] || 'PRESENTE' }));
      const result = await createResource(`/aulas/${aulaId}/chamada`, { presencas });
      setMessage(result.message);
      refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const present = Object.values(marks).filter((value) => value === 'PRESENTE').length;
  const absent = Object.values(marks).filter((value) => value === 'FALTA').length;

  return (
    <section className="call-page">
      <div className="call-head">
        <div><h2>Fazer chamada</h2><p>Alunos</p></div>
        <div className="filters"><select value={aulaId} onChange={(event) => setAulaId(event.target.value)}><option value="">Seleccionar aula</option>{aulas.map((aula) => <option key={aula.id} value={aula.id}>{aula.disciplina} - {aula.turma}</option>)}</select></div>
      </div>
      {message && <div className="notice">{message}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>N</th><th>Aluno</th><th>Presente</th><th>Falta</th></tr></thead>
          <tbody>
            {alunos.length === 0 && <tr><td colSpan="4">Nao existem aulas atribuídas para hoje.</td></tr>}
            {alunos.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td><Icon name="user" />{row.nome}</td>
                <td><input type="radio" name={`a-${row.id}`} checked={marks[row.id] === 'PRESENTE'} onChange={() => setMarks({ ...marks, [row.id]: 'PRESENTE' })} /></td>
                <td><input type="radio" name={`a-${row.id}`} checked={marks[row.id] === 'FALTA'} onChange={() => setMarks({ ...marks, [row.id]: 'FALTA' })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="call-summary"><span>Presentes: {present}</span><span>Faltas: {absent}</span><button className="btn primary" disabled={!aulaId || alunos.length === 0} onClick={submit}>Submeter chamada</button></div>
    </section>
  );
}

function Absences({ refreshKey, refresh }) {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');
  const [justifyId, setJustifyId] = useState('');
  const [motivo, setMotivo] = useState('');
  useEffect(() => { getResource('/faltas').then(setRows).catch((error) => setMessage(error.message)); }, [refreshKey]);
  async function justify(event) {
    event.preventDefault();
    try {
      const result = await updateResource(`/presencas/${justifyId}/justificar`, { motivo });
      setMessage(result.message);
      setJustifyId('');
      setMotivo('');
      refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="data-page">
      <Toolbar title="Faltas" />
      {message && <div className="notice">{message}</div>}
      <DataTable rows={rows} columns={[['aluno', 'Aluno'], ['turma', 'Turma'], ['disciplina', 'Disciplina'], ['data_aula', 'Data'], ['estado', 'Estado']]} />
      <form className="inline-form" onSubmit={justify}>
        <select required value={justifyId} onChange={(event) => setJustifyId(event.target.value)}><option value="">Falta para justificar</option>{rows.filter((r) => r.estado !== 'Justificada').map((r) => <option key={r.id} value={r.id}>{r.aluno} - {r.disciplina}</option>)}</select>
        <input required minLength="3" maxLength="255" placeholder="Motivo *" value={motivo} onChange={(event) => setMotivo(event.target.value)} />
        <button className="btn primary">Justificar</button>
      </form>
    </section>
  );
}

function Ppf({ refreshKey }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { getResource('/ppf').then(setRows); }, [refreshKey]);
  return <section className="data-page"><Toolbar title="Punicao por Faltas - PPF" /><DataTable rows={rows} columns={[['aluno', 'Aluno'], ['disciplina', 'Disciplina'], ['faltas_nao_justificadas', 'Faltas'], ['estado', 'Estado']]} /></section>;
}

function Notifications({ refreshKey }) {
  const [rows, setRows] = useState([]);
  const [activeTab, setActiveTab] = useState('history');
  const [smsConfig, setSmsConfig] = useState(null);
  const [templates, setTemplates] = useState({ FALTA: '', PPF: '', GERAL: '' });
  const [testPhone, setTestPhone] = useState('+258876386514');
  const [testMessage, setTestMessage] = useState('Aviso StudentControl: Teste de disparo de SMS enviado com sucesso para o encarregado.');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getResource('/notificacoes').then(setRows).catch(() => {});
    getResource('/config/sms').then((config) => {
      setSmsConfig(config);
      if (config.templates) setTemplates(config.templates);
    }).catch(() => {});
  }, [refreshKey]);

  async function handleSaveTemplates(e) {
    e.preventDefault();
    setNotice('');
    setLoading(true);
    try {
      const res = await createResource('/config/sms', { templates });
      setNotice(res.message);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendTestSms(e) {
    e.preventDefault();
    setNotice('');
    setLoading(true);
    try {
      const res = await createResource('/config/sms/test', {
        destinatario: testPhone,
        mensagem: testMessage
      });
      const dispatch = res.result?.dispatchResult || {};
      const estado = res.result?.estado;

      if (!dispatch.success) {
        setNotice(`❌ Falha no disparo do SMS: ${dispatch.error || 'A gateway Infobip rejeitou a mensagem.'}`);
      } else if (dispatch.simulated) {
        setNotice(`⚠️ Disparo processado em MODO DE SIMULAÇÃO! ${dispatch.detail || 'Nenhuma SMS real foi enviada ao telemóvel.'}`);
      } else {
        setNotice(`✅ SMS enviada com sucesso para a gateway Infobip! (Status: ${dispatch.statusName || 'PENDING_ACCEPTED'} | MessageID: ${dispatch.messageId || 'N/A'})`);
      }
      getResource('/notificacoes').then(setRows);
    } catch (err) {
      setNotice(`❌ Falha no disparo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="data-page">
      <div className="toolbar" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Avisos e Notificações SMS</h2>
          <p className="muted">Gestão de disparos e personalização de mensagens para encarregados.</p>
        </div>
        <div className="sms-mode-badge">
          <Icon name="phone" size={16} />
          <span>Modo: <strong>{smsConfig?.mode === 'infobip' ? 'Infobip Live API' : 'Simulação'}</strong></span>
          <span className="api-tag">{smsConfig?.apiKey || 'Sem API Key'}</span>
        </div>
      </div>

      <div className="tab-navigation">
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          <Icon name="attendance" size={16} /> Histórico de Envio
        </button>
        <button className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>
          <Icon name="edit" size={16} /> Personalizar Mensagens SMS
        </button>
        <button className={activeTab === 'test' ? 'active' : ''} onClick={() => setActiveTab('test')}>
          <Icon name="notifications" size={16} /> Disparo de Teste (Infobip)
        </button>
      </div>

      {notice && <div className="notice full">{notice}</div>}

      {activeTab === 'history' && (
        <DataTable
          rows={rows}
          columns={[
            ['encarregado', 'Encarregado'],
            ['tipo', 'Tipo'],
            ['destinatario', 'Destinatário'],
            ['mensagem', 'Mensagem Personalizada'],
            ['estado', 'Estado'],
            ['criado_em', 'Data/Hora']
          ]}
        />
      )}

      {activeTab === 'templates' && (
        <form className="form-page sms-templates-form" onSubmit={handleSaveTemplates}>
          <h3>Personalização de Modelos de SMS</h3>
          <p className="muted">
            Configure o texto padrão das mensagens enviadas aos encarregados. Pode incluir as tags dinâmicas abaixo:
          </p>
          <div className="tags-container">
            <code>{'{encarregado}'}</code>
            <code>{'{aluno}'}</code>
            <code>{'{disciplina}'}</code>
            <code>{'{turma}'}</code>
            <code>{'{data}'}</code>
            <code>{'{faltas}'}</code>
          </div>

          <div className="template-field" style={{ marginTop: '16px' }}>
            <label>Modelo de SMS para Marcação de Falta (FALTA)</label>
            <textarea
              rows={3}
              value={templates.FALTA}
              onChange={(e) => setTemplates({ ...templates, FALTA: e.target.value })}
              required
            />
          </div>

          <div className="template-field" style={{ marginTop: '16px' }}>
            <label>Modelo de SMS para Limite de Faltas (PPF)</label>
            <textarea
              rows={3}
              value={templates.PPF}
              onChange={(e) => setTemplates({ ...templates, PPF: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A guardar...' : 'Guardar Modelos de SMS'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'test' && (
        <form className="form-page sms-test-form" onSubmit={handleSendTestSms}>
          <h3>Disparo de Teste de Notificação (Infobip API)</h3>
          <p className="muted">
            Envie uma SMS de teste em tempo real utilizando a chave de API configurada para testar o envio para um telemóvel moçambicano.
          </p>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr', marginTop: '16px' }}>
            <div>
              <label>Número de Telemóvel do Encarregado (Moçambique)</label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+258876386514"
                required
              />
            </div>

            <div>
              <label>Conteúdo da Mensagem de Teste</label>
              <textarea
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="sms-info-box" style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>💡 Guia de Resolução de Entrega em Moçambique (+258):</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
              <li><strong>Modo de Simulação:</strong> Se o modo for <em>Simulação</em>, as SMS são registadas na base de dados mas não chegam aos telemóveis reais.</li>
              <li><strong>Sender ID (Remetente):</strong> Operadoras como Vodacom (84/85), Movitel (86/87) e Tmcel (82/83) filtram Sender IDs não registados (ex.: <code>StudentCtrl</code>). Se o telemóvel não receber, limpe ou omitida o <code>SMS_SENDER</code> no <code>.env</code> do servidor para que a Infobip utilize o remetente numérico/padrão pré-aprovado.</li>
            </ul>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A disparar SMS...' : 'Disparar SMS de Teste'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function GuardianDashboard({ refreshKey }) {
  const [data, setData] = useState({ educandos: [] });
  useEffect(() => { getResource('/dashboard/encarregado').then(setData).catch(() => setData({ educandos: [] })); }, [refreshKey]);
  const first = data.educandos[0] || {};
  return (
    <section className="page-grid">
      <div className="stats">
        <Metric icon="students" label="Educandos" value={data.educandos.length} tone="green" />
        <Metric icon="calendar" label="Presencas" value={first.presencas || 0} tone="blue" />
        <Metric icon="alerts" label="Faltas" value={first.faltas || 0} tone="coral" />
        <Metric icon="bell" label="Nao justificadas" value={first.nao_justificadas || 0} tone="amber" />
      </div>
      <div className="chart-panel wide"><PanelTitle title="Assiduidade" /><div className="line-chart"></div></div>
      <div className="chart-panel"><PanelTitle title="Meus Educandos" /><ul>{data.educandos.map((e) => <li key={e.id}>{e.nome}</li>)}</ul></div>
    </section>
  );
}

function StudentProfile({ selected, setScreen }) {
  if (!selected) return <section className="profile-page"><button className="back" onClick={() => setScreen('students')}><Icon name="back" />Voltar</button><p>Nenhum aluno seleccionado.</p></section>;
  return (
    <section className="profile-page">
      <button className="back" onClick={() => setScreen('students')}><Icon name="back" />Voltar</button>
      <div className="profile-head"><div className="avatar-large"><Icon name="students" size={36} /></div><div><h2>{selected.nome}</h2><p>{selected.turma || 'Sem turma'} - {selected.numero_aluno} - {selected.estado}</p></div></div>
      <div className="tabs"><button className="active">Dados</button><button>Faltas</button><button>PPF</button><button>Encarregados</button></div>
      <div className="profile-grid">
        <div className="panel"><PanelTitle title="Informacao principal" /><dl><dt>Turma</dt><dd>{selected.turma || '-'}</dd><dt>Encarregado</dt><dd>{selected.encarregado || '-'}</dd><dt>Numero</dt><dd>{selected.numero_aluno}</dd></dl></div>
        <div className="panel"><PanelTitle title="Resumo de assiduidade" /><ul><li>Estado: {selected.estado}</li></ul></div>
      </div>
    </section>
  );
}

function ClassDetail({ selected, setScreen }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { if (selected?.id) getResource(`/turmas/${selected.id}/alunos`).then(setRows); }, [selected]);
  return (
    <section className="data-page">
      <button className="back" onClick={() => setScreen('classes')}><Icon name="back" />Voltar</button>
      <div className="tabs"><button className="active">Alunos</button><button>Disciplinas</button><button>Professores</button><button>Aulas</button></div>
      <Toolbar title={selected?.nome || 'Turma'} />
      <DataTable rows={rows} columns={[['numero_aluno', 'Numero'], ['nome', 'Aluno']]} />
    </section>
  );
}

function PanelTitle({ title }) {
  return <h3>{title}</h3>;
}

function bind(setForm, field) {
  return (event) => setForm((form) => ({ ...form, [field]: event.target.value }));
}

function iconName(key) {
  if (key === 'teacher-dashboard') return 'dashboard';
  if (key === 'associations') return 'subjects';
  if (key === 'lessons') return 'calendar';
  if (key === 'notifications') return 'bell';
  if (key === 'call') return 'attendance';
  return key;
}

function formatCell(value) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'string' && value.includes('T')) return value.slice(0, 10);
  return value;
}

createRoot(document.getElementById('root')).render(<App />);
