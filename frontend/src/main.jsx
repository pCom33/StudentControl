import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { apiRequest, createResource, deleteResource, forgotPassword, getResource, login, resetPassword, updateResource, verify2FACode } from './api.js';
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
  ],
  file: [
    <path key="f1" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
    <polyline key="f2" points="14 2 14 8 20 8" />,
    <line key="f3" x1="16" y1="13" x2="8" y2="13" />,
    <line key="f4" x1="16" y1="17" x2="8" y2="17" />
  ],
  paperclip: [
    <path key="pc1" d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  ],
  close: [
    <line key="cl1" x1="18" y1="6" x2="6" y2="18" />,
    <line key="cl2" x1="6" y1="6" x2="18" y2="18" />
  ],
  download: [
    <path key="dl1" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />,
    <polyline key="dl2" points="7 10 12 15 17 10" />,
    <line key="dl3" x1="12" y1="15" x2="12" y2="3" />
  ],
  info: [
    <circle key="inf1" cx="12" cy="12" r="10" />,
    <line key="inf2" x1="12" y1="16" x2="12" y2="12" />,
    <line key="inf3" x1="12" y1="8" x2="12.01" y2="8" />
  ],
  shield: [
    <path key="sh1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ],
  globe: [
    <circle key="gl1" cx="12" cy="12" r="10" />,
    <line key="gl2" x1="2" y1="12" x2="22" y2="12" />,
    <path key="gl3" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

function Footer({ isLogin = false }) {
  const currentYear = new Date().getFullYear();
  if (isLogin) {
    return (
      <footer className="app-footer app-footer-login">
        <p>&copy; {currentYear} StudentControl. Todos os direitos reservados.</p>
      </footer>
    );
  }
  return (
    <footer className="app-footer">
      <span>StudentControl</span>
      <span>&copy; {currentYear} Todos os direitos reservados.</span>
    </footer>
  );
}

function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [menuExpanded, setMenuExpanded] = useState(() => localStorage.getItem('studentcontrol_menu') !== 'collapsed');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function afterLogin(nextUser) {
    setUser(nextUser);
    setScreen(nextUser.perfil === 'PROFESSOR' ? 'teacher-dashboard' : nextUser.perfil === 'ENCARREGADO' ? 'guardian-dashboard' : 'dashboard');
  }

  function logout() {
    localStorage.removeItem('studentcontrol_token');
    setUser(null);
    setScreen('login');
    setMobileMenuOpen(false);
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
      <div className={`sidebar-backdrop ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <Sidebar
        active={screen}
        setScreen={(s) => {
          setScreen(s);
          setMobileMenuOpen(false);
        }}
        user={user}
        onLogout={logout}
        expanded={menuExpanded}
        mobileOpen={mobileMenuOpen}
        onToggle={() => {
          setMenuExpanded((current) => {
            localStorage.setItem('studentcontrol_menu', current ? 'collapsed' : 'expanded');
            return !current;
          });
        }}
      />
      <main className="workspace">
        <Topbar title={title} user={user} onLogout={logout} onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)} />
        <div className="content">
          <ScreenRouter screen={screen} setScreen={setScreen} user={user} refreshKey={refreshKey} refresh={() => setRefreshKey((key) => key + 1)} />
        </div>
        <Footer />
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'request_code' | 'verify_2fa' | 'reset_password'

  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handlePinChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...pinDigits];
    nextDigits[index] = digit;
    setPinDigits(nextDigits);

    if (digit && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  function handlePinKeyDown(index, event) {
    if (event.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  async function handleLoginSubmit(event) {
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

  async function handleRequestCodeSubmit(event) {
    event.preventDefault();
    setMessage('');
    setNotice('');
    setLoading(true);
    try {
      const result = await forgotPassword(recoveryEmail);
      setNotice(result.message);
      setPinDigits(['', '', '', '']);
      setMode('verify_2fa');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify2FASubmit(event) {
    event.preventDefault();
    setMessage('');
    setNotice('');
    const fullCode = pinDigits.join('');
    if (fullCode.length < 4) {
      setMessage('Por favor, introduza o código completo de 4 dígitos.');
      return;
    }
    setLoading(true);
    try {
      await verify2FACode(recoveryEmail, fullCode);
      setNotice('Código de 4 dígitos verificado com sucesso! Defina a sua nova palavra-passe.');
      setMode('reset_password');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPasswordSubmit(event) {
    event.preventDefault();
    setMessage('');
    setNotice('');
    if (newPassword !== confirmPassword) {
      setMessage('As palavras-passes introduzidas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const fullCode = pinDigits.join('');
      const result = await resetPassword(recoveryEmail, fullCode, newPassword);
      setNotice(result.message);
      setEmail(recoveryEmail);
      setPassword('');
      setMode('login');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function resetToLogin() {
    setMode('login');
    setMessage('');
    setNotice('');
  }

  return (
    <main className="login-page">
      <div className="login-page-content">
        {mode === 'login' && (
        <form className="login-panel" onSubmit={handleLoginSubmit}>
          <div className="login-logo-container">
            <Logo size={42} />
          </div>
          <p className="login-subtitle">Iniciar sessão para aceder ao sistema</p>

          <label>Email</label>
          <div className="input-icon">
            <Icon name="mail" />
            <input
              type="email"
              required
              placeholder="seuemail@gmail.com"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <label>Palavra-passe</label>
          <div className="input-icon">
            <Icon name="lock" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              minLength="6"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Mostrar palavra-passe
          </label>

          {notice && <div className="notice" style={{ marginTop: '14px' }}>{notice}</div>}
          {message && <div className="alert">{message}</div>}

          <button className="btn primary" type="submit" style={{ marginTop: '16px' }}>Entrar</button>

          <button
            type="button"
            className="forgot-password-link"
            onClick={() => {
              setRecoveryEmail(email);
              setMessage('');
              setNotice('');
              setMode('request_code');
            }}
          >
            Esqueceu a palavra-passe?
          </button>
        </form>
      )}

      {mode === 'request_code' && (
        <form className="login-panel" onSubmit={handleRequestCodeSubmit}>
          <div className="login-logo-container">
            <Logo size={42} />
          </div>
          <h3 className="recovery-title">Recuperação de Conta</h3>
          <p className="login-subtitle">Introduza o seu email para receber o código de 4 dígitos</p>

          <label>Email da Conta</label>
          <div className="input-icon">
            <Icon name="mail" />
            <input
              type="email"
              required
              placeholder="seuemail@gmail.com"
              value={recoveryEmail}
              onChange={(event) => setRecoveryEmail(event.target.value)}
            />
          </div>

          {message && <div className="alert">{message}</div>}

          <div className="recovery-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A enviar...' : 'Enviar código de 4 dígitos'}
            </button>
            <button className="btn secondary" type="button" onClick={resetToLogin}>
              Voltar ao login
            </button>
          </div>
        </form>
      )}

      {mode === 'verify_2fa' && (
        <form className="login-panel" onSubmit={handleVerify2FASubmit}>
          <div className="login-logo-container">
            <Logo size={42} />
          </div>
          <h3 className="recovery-title">Autenticação de 2 Fatores</h3>
          <p className="login-subtitle">
            Enviámos o código de verificação de 4 dígitos para o seu endereço de email <strong>{recoveryEmail}</strong>. Por favor, consulte a sua caixa de entrada.
          </p>

          <label style={{ textAlign: 'center', marginTop: '12px' }}>Código de Verificação (4 dígitos)</label>
          <div className="pin-container">
            {pinDigits.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-input-${idx}`}
                className="pin-digit"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(idx, e)}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {message && <div className="alert">{message}</div>}

          <div className="recovery-actions">
            <button className="btn primary" type="submit" disabled={loading || pinDigits.join('').length < 4}>
              {loading ? 'A verificar...' : 'Verificar código 2FA'}
            </button>
            <button className="btn secondary" type="button" onClick={resetToLogin}>
              Voltar ao login
            </button>
          </div>
        </form>
      )}

      {mode === 'reset_password' && (
        <form className="login-panel" onSubmit={handleResetPasswordSubmit}>
          <div className="login-logo-container">
            <Logo size={42} />
          </div>
          <h3 className="recovery-title">Definir Nova Palavra-passe</h3>
          <p className="login-subtitle">Crie uma nova palavra-passe segura para a sua conta</p>

          <label>Nova Palavra-passe</label>
          <div className="input-icon">
            <Icon name="lock" />
            <input
              type="password"
              required
              minLength="6"
              placeholder="No mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <label>Confirmar Nova Palavra-passe</label>
          <div className="input-icon">
            <Icon name="lock" />
            <input
              type="password"
              required
              minLength="6"
              placeholder="Repita a palavra-passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && <div className="alert">{message}</div>}

          <div className="recovery-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A redefinir...' : 'Redefinir Palavra-passe'}
            </button>
            <button className="btn secondary" type="button" onClick={resetToLogin}>
              Voltar ao login
            </button>
          </div>
        </form>
      )}
      </div>
      <Footer isLogin={true} />
    </main>
  );
}

function Sidebar({ active, setScreen, user, onLogout, expanded, mobileOpen, onToggle }) {
  const items = navByRole[user.perfil] || navByRole.SECRETARIA;
  return (
    <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        <div className="side-logo-wrap">
          <Logo size={expanded ? 26 : 30} variant={expanded ? 'full' : 'mark'} />
        </div>
        <button
          className="menu-button"
          type="button"
          title={expanded ? 'Recolher menu' : 'Expandir menu'}
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
          onClick={onToggle}
        >
          <Icon name="menu" />
        </button>
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

function Topbar({ title, user, onLogout, onToggleMobileMenu }) {
  return (
    <header className="topbar">
      <button className="mobile-menu-btn" type="button" aria-label="Abrir menu mobile" title="Abrir menu" onClick={onToggleMobileMenu}>
        <Icon name="menu" />
      </button>
      <div className="search"><Icon name="search" /><input placeholder="Pesquisar..." readOnly /></div>
      <div className="top-actions">
        <span>{title}</span>
        <span className="user-name">{user.nome}</span>
        <button className="icon-button" aria-label="Notificações"><Icon name="bell" /></button>
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

const onlyLetters = (val) => String(val || '').replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, '');
const onlyDigits = (val) => String(val || '').replace(/\D/g, '');
const onlyPhone = (val) => String(val || '').replace(/[^0-9+]/g, '');

function EditModal({ resource, row, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({ ...row }));
  const [refs, setRefs] = useState({ turmas: [], encarregados: [], alunos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resource === 'alunos') {
      Promise.all([getResource('/turmas'), getResource('/encarregados')])
        .then(([turmas, encarregados]) => setRefs((r) => ({ ...r, turmas, encarregados })))
        .catch(() => {});
    } else if (resource === 'encarregados') {
      getResource('/alunos')
        .then((alunos) => setRefs((r) => ({ ...r, alunos })))
        .catch(() => {});
    }
  }, [resource]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      if (resource === 'alunos') {
        payload.nome = onlyLetters(payload.nome);
        payload.numero_aluno = onlyDigits(payload.numero_aluno);
        if (payload.encarregado_id === '') payload.encarregado_id = null;
        if (payload.turma_id === '') payload.turma_id = null;
      } else if (resource === 'encarregados') {
        payload.nome = onlyLetters(payload.nome);
        payload.telefone = onlyPhone(payload.telefone);
        if (payload.parentesco) payload.parentesco = onlyLetters(payload.parentesco);
      } else if (resource === 'professores') {
        payload.nome = onlyLetters(payload.nome);
        payload.telefone = onlyPhone(payload.telefone);
      } else if (resource === 'turmas') {
        payload.ano_lectivo = onlyDigits(payload.ano_lectivo);
      } else if (resource === 'disciplinas') {
        payload.nome = onlyLetters(payload.nome);
        payload.limite_ppf = onlyDigits(payload.limite_ppf);
      }

      await updateResource(`/${resource}/${row.id}`, payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div className="edit-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h3>Editar {resource === 'alunos' ? 'Estudante' : resource === 'encarregados' ? 'Encarregado' : resource === 'professores' ? 'Professor' : resource === 'turmas' ? 'Turma' : 'Disciplina'}</h3>
          <button className="modal-close-btn" type="button" onClick={onClose} title="Fechar"><Icon name="close" size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="edit-modal-body">
            {error && <div className="alert">{error}</div>}

            {resource === 'alunos' && (
              <>
                <div className="modal-field">
                  <label>Nome do Aluno * (Apenas Letras)</label>
                  <input
                    type="text"
                    required
                    value={form.nome || ''}
                    onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })}
                    placeholder="Nome completo do aluno"
                  />
                  <span className="field-hint">Apenas letras, sem números ou símbolos</span>
                </div>
                <div className="modal-field">
                  <label>Número do Aluno * (Apenas Números)</label>
                  <input
                    type="text"
                    required
                    value={form.numero_aluno || ''}
                    onChange={(e) => setForm({ ...form, numero_aluno: onlyDigits(e.target.value) })}
                    placeholder="Ex.: 1024"
                  />
                  <span className="field-hint">Apenas dígitos numéricos</span>
                </div>
                <div className="modal-field">
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    value={form.data_nascimento ? String(form.data_nascimento).slice(0, 10) : ''}
                    onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Turma</label>
                  <select
                    value={form.turma_id || ''}
                    onChange={(e) => setForm({ ...form, turma_id: e.target.value ? Number(e.target.value) : '' })}
                  >
                    <option value="">Sem Turma</option>
                    {refs.turmas.map((t) => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Encarregado de Educação</label>
                  <select
                    value={form.encarregado_id || ''}
                    onChange={(e) => setForm({ ...form, encarregado_id: e.target.value ? Number(e.target.value) : '' })}
                  >
                    <option value="">Sem Encarregado</option>
                    {refs.encarregados.map((enc) => (
                      <option key={enc.id} value={enc.id}>{enc.nome} ({enc.telefone})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {resource === 'encarregados' && (
              <>
                <div className="modal-field">
                  <label>Nome do Encarregado * (Apenas Letras)</label>
                  <input
                    type="text"
                    required
                    value={form.nome || ''}
                    onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })}
                    placeholder="Nome completo do encarregado"
                  />
                </div>
                <div className="modal-field">
                  <label>Telefone / Celular * (SMS Infobip)</label>
                  <input
                    type="text"
                    required
                    value={form.telefone || ''}
                    onChange={(e) => setForm({ ...form, telefone: onlyPhone(e.target.value) })}
                    placeholder="+25884xxxxxxx"
                  />
                  <span className="field-hint">Ex.: +258846634391 ou 846634391</span>
                </div>
                <div className="modal-field">
                  <label>Email do Encarregado (Para Notificações de Falta via Gmail)</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email.do.encarregado@gmail.com"
                  />
                  <span className="field-hint">Obrigatório para o encarregado receber avisos de falta por email</span>
                </div>
                <div className="modal-field">
                  <label>Parentesco (Apenas Letras)</label>
                  <input
                    type="text"
                    value={form.parentesco || ''}
                    onChange={(e) => setForm({ ...form, parentesco: onlyLetters(e.target.value) })}
                    placeholder="Pai, Mãe, Tio, Tutor..."
                  />
                </div>
                <div className="modal-field">
                  <label>Vincular a Aluno (Educando)</label>
                  <select
                    value={form.aluno_id || ''}
                    onChange={(e) => setForm({ ...form, aluno_id: e.target.value ? Number(e.target.value) : '' })}
                  >
                    <option value="">Manter vínculo actual</option>
                    {refs.alunos.map((al) => (
                      <option key={al.id} value={al.id}>{al.nome} ({al.numero_aluno})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {resource === 'professores' && (
              <>
                <div className="modal-field">
                  <label>Nome do Professor * (Apenas Letras)</label>
                  <input
                    type="text"
                    required
                    value={form.nome || ''}
                    onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })}
                  />
                </div>
                <div className="modal-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={form.telefone || ''}
                    onChange={(e) => setForm({ ...form, telefone: onlyPhone(e.target.value) })}
                  />
                </div>
              </>
            )}

            {resource === 'turmas' && (
              <>
                <div className="modal-field">
                  <label>Nome da Turma *</label>
                  <input
                    type="text"
                    required
                    value={form.nome || ''}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Ano Lectivo * (Apenas Números)</label>
                  <input
                    type="text"
                    required
                    value={form.ano_lectivo || ''}
                    onChange={(e) => setForm({ ...form, ano_lectivo: onlyDigits(e.target.value) })}
                    placeholder="2026"
                  />
                </div>
                <div className="modal-field">
                  <label>Classe *</label>
                  <input
                    type="text"
                    required
                    value={form.classe || ''}
                    onChange={(e) => setForm({ ...form, classe: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Turno *</label>
                  <select
                    value={form.turno || 'Manha'}
                    onChange={(e) => setForm({ ...form, turno: e.target.value })}
                  >
                    <option value="Manha">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
              </>
            )}

            {resource === 'disciplinas' && (
              <>
                <div className="modal-field">
                  <label>Nome da Disciplina * (Apenas Letras)</label>
                  <input
                    type="text"
                    required
                    value={form.nome || ''}
                    onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })}
                  />
                </div>
                <div className="modal-field">
                  <label>Limite PPF * (Apenas Números)</label>
                  <input
                    type="text"
                    required
                    value={form.limite_ppf || ''}
                    onChange={(e) => setForm({ ...form, limite_ppf: onlyDigits(e.target.value) })}
                  />
                </div>
              </>
            )}

            <div className="modal-field">
              <label>Estado</label>
              <select
                value={form.activo === 0 || form.estado === 'Inactivo' ? '0' : '1'}
                onChange={(e) => setForm({ ...form, activo: Number(e.target.value) })}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="edit-modal-footer">
            <button className="btn secondary" type="button" onClick={onClose}>Cancelar</button>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ resource, row, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const label = row?.nome || row?.numero_aluno || 'este registo';
  const resourceLabel = resource === 'alunos' ? 'Estudante' :
                        resource === 'encarregados' ? 'Encarregado de Educação' :
                        resource === 'professores' ? 'Professor' :
                        resource === 'turmas' ? 'Turma' : 'Disciplina';

  async function handleConfirmDelete() {
    setLoading(true);
    setError('');
    try {
      const result = await deleteResource(`/${resource}/${row.id}?permanent=true`);
      onDeleted(result.message || 'Registo eliminado permanentemente com sucesso da base de dados.');
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao eliminar registo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="edit-modal-backdrop" onClick={() => !loading && onClose()}>
      <div className="edit-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="edit-modal-header" style={{ borderBottom: '1px solid #fee2e2' }}>
          <h3 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="trash" size={18} />
            Eliminar {resourceLabel}
          </h3>
          <button className="modal-close-btn" type="button" onClick={onClose} disabled={loading} title="Fechar">
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="edit-modal-body">
          {error && <div className="alert" style={{ marginBottom: '12px' }}>{error}</div>}
          <div className="delete-confirm-box">
            <p style={{ margin: 0 }}>
              Tem a certeza de que deseja eliminar permanentemente <strong>"{label}"</strong> da base de dados?
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#b91c1c' }}>
              Atenção: Esta ação é definitiva e removerá todos os vínculos (faltas, presenças, notas, PPF e associações) associados a este registo na base de dados.
            </p>
          </div>
        </div>
        <div className="edit-modal-footer">
          <button className="btn secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn danger" type="button" onClick={handleConfirmDelete} disabled={loading} style={{ minWidth: '140px' }}>
            {loading ? 'A eliminar...' : 'Confirmar e Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceList({ resource, title, addScreen, columns, detailScreen, setScreen, setSelected, refreshKey, refresh }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);

  useEffect(() => {
    load();
  }, [resource, refreshKey]);

  async function load() {
    try {
      const data = await getResource(`/${resource}`);
      setRows(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(row) {
    const label = row.nome || row.numero_aluno || 'este registo';
    try {
      const result = await deleteResource(`/${resource}/${row.id}`);
      setMessage(result.message);
      load();
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
        onEdit={(row) => setEditingRow(row)}
        onDelete={remove}
        onDeletePermanent={(row) => setDeletingRow(row)}
      />
      {editingRow && (
        <EditModal
          resource={resource}
          row={editingRow}
          onClose={() => setEditingRow(null)}
          onSaved={() => {
            setMessage('Alterações guardadas com sucesso na base de dados.');
            load();
            refresh();
          }}
        />
      )}
      {deletingRow && (
        <DeleteModal
          resource={resource}
          row={deletingRow}
          onClose={() => setDeletingRow(null)}
          onDeleted={(msg) => {
            setMessage(msg);
            load();
            refresh();
          }}
        />
      )}
    </section>
  );
}

function Toolbar({ title, add, addLabel = 'Novo', search, setSearch }) {
  return (
    <div className="toolbar">
      <div>
        <h2>{title}</h2>
        <div className="filters">
          <input placeholder="Pesquisar..." value={search || ''} onChange={(event) => setSearch?.(event.target.value)} />
          <select><option>Estado: Todos</option></select>
        </div>
      </div>
      {add && <button className="btn primary icon-text" type="button" onClick={add}><Icon name="add" />{addLabel}</button>}
    </div>
  );
}

function DataTable({ rows, columns, onOpen, onEdit, onDelete, onDeletePermanent, onJustify }) {
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
                  {key === 'documento_anexo' ? (
                    row[key] ? (
                      <a
                        href={`http://127.0.0.1:4000${row[key]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="anexo-btn"
                        title="Abrir scanner/PDF do comprovativo"
                      >
                        <Icon name="file" size={13} />
                        <span>Ver Documento</span>
                      </a>
                    ) : (
                      <span className="anexo-vazio">Sem anexo</span>
                    )
                  ) : key === 'nome' && onOpen ? (
                    <button className="link-cell" onClick={() => onOpen(row)}><Icon name="user" />{row[key]}</button>
                  ) : (
                    formatCell(row[key])
                  )}
                </td>
              ))}
              <td className="actions-cell">
                {onOpen && <button className="btn secondary compact" type="button" onClick={() => onOpen(row)}>Abrir</button>}
                {onEdit && (
                  <button className="btn secondary compact icon-text" type="button" title="Editar registo na base de dados" onClick={() => onEdit(row)}>
                    <Icon name="edit" size={13} />
                    <span>Editar</span>
                  </button>
                )}
                {onDelete && <button className="btn secondary compact" type="button" title="Desactivar registo" onClick={() => onDelete(row)}>Desactivar</button>}
                {onDeletePermanent && (
                  <button className="btn danger compact icon-text" type="button" title="Eliminar permanentemente da base de dados" onClick={() => onDeletePermanent(row)}>
                    <Icon name="trash" size={13} />
                    <span>Eliminar</span>
                  </button>
                )}
                {onJustify && row.estado !== 'Justificada' && (
                  <button className="btn primary compact" type="button" onClick={() => onJustify(row)}>
                    Justificar (Anexar PDF)
                  </button>
                )}
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
  useEffect(() => { Promise.all([getResource('/turmas'), getResource('/encarregados')])
    .then(([turmas, encarregados]) => setRefs({ turmas, encarregados }))
    .catch(() => {});
  }, []);
  return (
    <ApiForm title="Novo aluno" submit="Guardar aluno" back="students" setScreen={setScreen} refresh={refresh} path="/alunos" form={form} setForm={setForm}>
      <input placeholder="Nome completo (Apenas letras) *" required minLength="2" maxLength="160" value={form.nome} onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })} />
      <input placeholder="Número do aluno (Apenas números) *" required maxLength="60" value={form.numero_aluno} onChange={(e) => setForm({ ...form, numero_aluno: onlyDigits(e.target.value) })} />
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
      <input placeholder="Nome completo (Apenas letras) *" required minLength="2" maxLength="160" value={form.nome} onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })} />
      <input type="email" placeholder="Email *" required maxLength="160" value={form.email} onChange={bind(setForm, 'email')} />
      <input type="tel" placeholder="Telefone (+258...)" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: onlyPhone(e.target.value) })} />
      <input type="password" placeholder="Palavra-passe inicial *" required minLength="6" value={form.password} onChange={bind(setForm, 'password')} />
      <select value={form.activo} onChange={bind(setForm, 'activo')}><option value="1">Activo</option><option value="0">Inactivo</option></select>
    </ApiForm>
  );
}

function GuardianForm({ setScreen, refresh }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ nome: '', telefone: '+258876386514', email: '', parentesco: '', aluno_id: '', activo: 1 });
  useEffect(() => { getResource('/alunos').then(setStudents).catch(() => {}); }, []);
  return (
    <ApiForm title="Novo encarregado" submit="Guardar encarregado" back="guardians" setScreen={setScreen} refresh={refresh} path="/encarregados" form={form} setForm={setForm}>
      <input placeholder="Nome completo (Apenas letras) *" required minLength="2" maxLength="160" value={form.nome} onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })} />
      <input type="tel" placeholder="Telefone para notificações (+258...) *" required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: onlyPhone(e.target.value) })} />
      <input type="email" placeholder="Email do encarregado (para receber faltas)" maxLength="160" value={form.email} onChange={bind(setForm, 'email')} />
      <input placeholder="Parentesco (Apenas letras)" value={form.parentesco} onChange={(e) => setForm({ ...form, parentesco: onlyLetters(e.target.value) })} />
      <select value={form.aluno_id} onChange={bind(setForm, 'aluno_id')}><option value="">Educando (Aluno)</option>{students.map((s) => <option key={s.id} value={s.id}>{s.nome} ({s.numero_aluno})</option>)}</select>
      <select value={form.activo} onChange={bind(setForm, 'activo')}><option value="1">Activo</option><option value="0">Inactivo</option></select>
    </ApiForm>
  );
}

function ClassForm({ setScreen, refresh }) {
  const [form, setForm] = useState({ nome: '', ano_lectivo: '2026', classe: '', turno: 'Manha', activo: 1 });
  return (
    <ApiForm title="Nova turma" submit="Guardar turma" back="classes" setScreen={setScreen} refresh={refresh} path="/turmas" form={form} setForm={setForm}>
      <input placeholder="Nome da turma *" required maxLength="80" value={form.nome} onChange={bind(setForm, 'nome')} />
      <input type="text" placeholder="Ano lectivo (Apenas números) *" required value={form.ano_lectivo} onChange={(e) => setForm({ ...form, ano_lectivo: onlyDigits(e.target.value) })} />
      <input placeholder="Classe *" required maxLength="40" value={form.classe} onChange={bind(setForm, 'classe')} />
      <select value={form.turno} onChange={bind(setForm, 'turno')}><option value="Manha">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option></select>
    </ApiForm>
  );
}

function SubjectForm({ setScreen, refresh }) {
  const [form, setForm] = useState({ nome: '', limite_ppf: 6, activo: 1 });
  return (
    <ApiForm title="Nova disciplina" submit="Guardar disciplina" back="subjects" setScreen={setScreen} refresh={refresh} path="/disciplinas" form={form} setForm={setForm}>
      <input placeholder="Nome da disciplina (Apenas letras) *" required maxLength="120" value={form.nome} onChange={(e) => setForm({ ...form, nome: onlyLetters(e.target.value) })} />
      <input type="text" required placeholder="Limite PPF (Apenas números)" value={form.limite_ppf} onChange={(e) => setForm({ ...form, limite_ppf: onlyDigits(e.target.value) })} />
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
  const [observacao, setObservacao] = useState('');
  const [anexo, setAnexo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showMarcarModal, setShowMarcarModal] = useState(false);
  const [alunosList, setAlunosList] = useState([]);
  const [disciplinasList, setDisciplinasList] = useState([]);
  const [marcarForm, setMarcarForm] = useState({ aluno_id: '', disciplina_id: '', data: new Date().toISOString().slice(0, 10), hora_inicio: '08:00', hora_fim: '09:30' });
  const [marcarLoading, setMarcarLoading] = useState(false);
  const [marcarMsg, setMarcarMsg] = useState('');

  useEffect(() => {
    getResource('/faltas').then(setRows).catch((error) => setMessage(error.message));
  }, [refreshKey]);

  async function openMarcarModal() {
    setMarcarMsg('');
    setShowMarcarModal(true);
    try {
      const [alunos, disciplinas] = await Promise.all([
        getResource('/alunos'),
        getResource('/disciplinas')
      ]);
      setAlunosList(alunos || []);
      setDisciplinasList(disciplinas || []);
      if (alunos && alunos.length > 0) {
        setMarcarForm(prev => ({
          ...prev,
          aluno_id: prev.aluno_id || String(alunos[0].id),
          disciplina_id: prev.disciplina_id || (disciplinas?.[0] ? String(disciplinas[0].id) : '')
        }));
      }
    } catch (err) {
      setMarcarMsg(err.message);
    }
  }

  async function handleMarcarFalta(e) {
    e.preventDefault();
    if (!marcarForm.aluno_id || !marcarForm.disciplina_id) {
      setMarcarMsg('Seleccione o aluno e a disciplina.');
      return;
    }
    setMarcarLoading(true);
    setMarcarMsg('');
    try {
      const res = await createResource('/presencas/marcar-falta', {
        aluno_id: Number(marcarForm.aluno_id),
        disciplina_id: Number(marcarForm.disciplina_id),
        data_aula: marcarForm.data,
        data: marcarForm.data,
        hora_inicio: marcarForm.hora_inicio,
        hora_fim: marcarForm.hora_fim
      });
      setMessage(res.message || 'Falta registada e notificação enviada ao encarregado.');
      setShowMarcarModal(false);
      refresh();
    } catch (err) {
      setMarcarMsg(err.message);
    } finally {
      setMarcarLoading(false);
    }
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('O ficheiro é demasiado grande. Por favor envie um ficheiro com até 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAnexo({
        nome: file.name,
        tipo: file.type,
        base64: reader.result,
        sizeKb: Math.round(file.size / 1024)
      });
    };
    reader.readAsDataURL(file);
  }

  async function justify(event) {
    event.preventDefault();
    if (!justifyId) {
      setMessage('Por favor, seleccione a falta que deseja justificar.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        motivo,
        observacao,
        anexo: anexo ? { nome: anexo.nome, tipo: anexo.tipo, base64: anexo.base64 } : null
      };
      const result = await updateResource(`/presencas/${justifyId}/justificar`, payload);
      setMessage(result.message);
      setJustifyId('');
      setMotivo('');
      setObservacao('');
      setAnexo(null);
      refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    ['aluno', 'Aluno'],
    ['turma', 'Turma'],
    ['disciplina', 'Disciplina'],
    ['data_aula', 'Data'],
    ['estado', 'Estado'],
    ['motivo', 'Motivo'],
    ['documento_anexo', 'Comprovativo']
  ];

  const quickMotivos = [
    'Atestado Médico / Doença',
    'Receita Médica / Farmácia',
    'Consulta Clínica / Hospitalar',
    'Motivo de Força Maior'
  ];

  const pendingAbsences = rows.filter((r) => r.estado !== 'Justificada');

  return (
    <section className="data-page">
      <Toolbar title="Controlo de Faltas e Justificações" add={openMarcarModal} addLabel="Marcar Falta (SMS + Email)" />
      {message && <div className="notice">{message}</div>}

      {showMarcarModal && (
        <div className="edit-modal-backdrop" onClick={() => !marcarLoading && setShowMarcarModal(false)}>
          <div className="edit-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="edit-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="attendance" size={20} />
                Marcar Falta (Disparo Imediato SMS + Email)
              </h3>
              <button type="button" className="icon-btn" onClick={() => setShowMarcarModal(false)} disabled={marcarLoading}>
                <Icon name="close" size={16} />
              </button>
            </div>
            <form onSubmit={handleMarcarFalta}>
              <div className="edit-modal-body">
                {marcarMsg && <div className="notice" style={{ marginBottom: '12px' }}>{marcarMsg}</div>}
                <div className="modal-field">
                  <label>Aluno *</label>
                  <select
                    required
                    value={marcarForm.aluno_id}
                    onChange={e => setMarcarForm({ ...marcarForm, aluno_id: e.target.value })}
                  >
                    <option value="">-- Seleccione o Aluno --</option>
                    {alunosList.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nome} (Nº {a.numero_aluno || a.id}) - {a.turma || ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Disciplina *</label>
                  <select
                    required
                    value={marcarForm.disciplina_id}
                    onChange={e => setMarcarForm({ ...marcarForm, disciplina_id: e.target.value })}
                  >
                    <option value="">-- Seleccione a Disciplina --</option>
                    {disciplinasList.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.nome} ({d.codigo || ''})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Data da Falta *</label>
                  <input
                    type="date"
                    required
                    value={marcarForm.data}
                    onChange={e => setMarcarForm({ ...marcarForm, data: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="modal-field">
                    <label>Hora Início</label>
                    <input
                      type="time"
                      value={marcarForm.hora_inicio}
                      onChange={e => setMarcarForm({ ...marcarForm, hora_inicio: e.target.value })}
                    />
                  </div>
                  <div className="modal-field">
                    <label>Hora Fim</label>
                    <input
                      type="time"
                      value={marcarForm.hora_fim}
                      onChange={e => setMarcarForm({ ...marcarForm, hora_fim: e.target.value })}
                    />
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--slate)', margin: '4px 0 0 0' }}>
                  Ao submeter, o sistema marca a falta, verifica o limite PPF e envia automaticamente SMS (Infobip) e Email (Gmail) ao encarregado do aluno.
                </p>
              </div>
              <div className="edit-modal-footer">
                <button type="button" className="btn secondary" onClick={() => setShowMarcarModal(false)} disabled={marcarLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn primary" disabled={marcarLoading}>
                  {marcarLoading ? 'A registar e a enviar...' : 'Marcar Falta e Notificar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DataTable
        rows={rows}
        columns={columns}
        onJustify={(row) => {
          setJustifyId(String(row.id));
          if (!motivo) setMotivo('Atestado Médico / Doença');
          const el = document.getElementById('justificar-form-card');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div className="justify-card" id="justificar-form-card">
        <div className="justify-card-head">
          <Icon name="attendance" size={20} />
          <h3>Justificar Falta e Anexar Documento (PDF ou Scanner de Receita/Atestado)</h3>
        </div>

        <form onSubmit={justify}>
          <div className="justify-grid">
            <div className="justify-field full-width">
              <label>Seleccionar Falta Não Justificada *</label>
              <select
                required
                value={justifyId}
                onChange={(event) => setJustifyId(event.target.value)}
              >
                <option value="">-- Escolha o aluno e a aula correspondente --</option>
                {pendingAbsences.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.aluno} — {r.disciplina} ({r.turma}, {r.data_aula})
                  </option>
                ))}
              </select>
              {pendingAbsences.length === 0 && (
                <span style={{ fontSize: '12px', color: '#16a34a', marginTop: '2px' }}>
                  Não existem faltas pendentes para justificação no momento.
                </span>
              )}
            </div>

            <div className="justify-field full-width">
              <label>Motivo da Justificação *</label>
              <input
                required
                minLength="3"
                maxLength="255"
                placeholder="Ex.: Doença comprovada por receita/atestado médico"
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--slate)' }}>Preenchimento rápido:</span>
                {quickMotivos.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="btn secondary compact"
                    style={{ fontSize: '11.5px', padding: '2px 8px', borderRadius: '4px' }}
                    onClick={() => setMotivo(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="justify-field">
              <label>Observações / Notas Adicionais (Opcional)</label>
              <textarea
                rows={3}
                placeholder="Ex.: Repouso de 3 dias recomendado pelo médico assistente Dr. António."
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
              />
            </div>

            <div className="justify-field">
              <label>Anexo do Documento (PDF ou Scanner de Receita / Atestado)</label>
              <label className="file-upload-box">
                <input
                  id="falta-file-input"
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileSelect}
                />
                <div className="file-upload-prompt">
                  <Icon name="paperclip" size={24} />
                  <span><strong>Clique aqui</strong> para seleccionar o ficheiro PDF ou Scanner</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Formatos suportados: PDF, JPG, PNG e WebP (até 10MB)</span>
                </div>
              </label>

              {anexo && (
                <div className="file-preview-badge" style={{ marginTop: '10px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="file" size={16} />
                    Documento: {anexo.nome} ({anexo.sizeKb} KB)
                  </span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    title="Remover anexo"
                    onClick={() => setAnexo(null)}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              className="btn primary"
              type="submit"
              disabled={loading || !justifyId || !motivo}
              style={{ minWidth: '160px' }}
            >
              {loading ? 'A guardar...' : 'Justificar Falta'}
            </button>
          </div>
        </form>
      </div>
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
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [broadcastDestino, setBroadcastDestino] = useState('TODOS');
  const [broadcastTurmaId, setBroadcastTurmaId] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  useEffect(() => {
    getResource('/notificacoes').then(setRows).catch(() => { });
    getResource('/turmas').then(setTurmas).catch(() => { });
    getResource('/config/sms').then((config) => {
      setSmsConfig(config);
      if (config.templates) setTemplates(config.templates);
    }).catch(() => { });
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

  async function handleSendBroadcast(e) {
    e.preventDefault();
    setNotice('');
    setLoading(true);
    try {
      const res = await createResource('/notificacoes/comunicado', {
        destino: broadcastDestino,
        turma_id: broadcastTurmaId || null,
        mensagem: broadcastMessage
      });
      setNotice(`[Sucesso] ${res.message || 'Disparo em lote concluído com sucesso!'}`);
      setBroadcastMessage('');
      getResource('/notificacoes').then(setRows);
    } catch (err) {
      setNotice(`[Erro] Falha no disparo em lote: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="data-page">
      <div className="toolbar" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Notificações aos Encarregados de Educação</h2>
          <p className="muted">Disparos em lote e automáticos emitidos simultaneamente para todos os encarregados.</p>
        </div>
        <div className="sms-mode-badge">
          <Icon name="notifications" size={16} />
          <span>Disparo: <strong>Em Lote (+50 Encarregados)</strong></span>
          <span className="api-tag">{smsConfig?.apiKey ? 'Gateway Infobip Activo' : 'Modo Simulação (SMS)'}</span>
        </div>
      </div>

      <div className="tab-navigation">
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          <Icon name="attendance" size={16} /> Histórico de Envio aos Encarregados
        </button>
        <button className={activeTab === 'broadcast' ? 'active' : ''} onClick={() => setActiveTab('broadcast')}>
          <Icon name="notifications" size={16} /> Enviar para Vários Encarregados (Lote)
        </button>
        <button className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>
          <Icon name="edit" size={16} /> Personalizar Mensagens SMS
        </button>
      </div>

      {notice && <div className="notice full">{notice}</div>}

      {activeTab === 'history' && (
        <DataTable
          rows={rows}
          columns={[
            ['encarregado', 'Encarregado'],
            ['tipo', 'Tipo'],
            ['destinatario', 'Contacto do Encarregado'],
            ['mensagem', 'Mensagem Emitida'],
            ['estado', 'Estado'],
            ['criado_em', 'Data/Hora']
          ]}
        />
      )}

      {activeTab === 'broadcast' && (
        <form className="form-page" onSubmit={handleSendBroadcast}>
          <h3>Disparo de Notificação em Lote para Encarregados</h3>
          <p className="muted">
            Envie uma notificação simultânea (por SMS e Email) para múltiplos encarregados (50 ou mais) de uma só vez utilizando o envio em lote de alta capacidade.
          </p>

          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '16px' }}>
            <div>
              <label>Público Alvo do Disparo</label>
              <select
                value={broadcastDestino}
                onChange={(e) => setBroadcastDestino(e.target.value)}
              >
                <option value="TODOS">Todos os Encarregados da Escola (Geral)</option>
                <option value="TURMA">Encarregados de uma Turma Específica</option>
              </select>
            </div>

            {broadcastDestino === 'TURMA' && (
              <div>
                <label>Seleccionar Turma</label>
                <select
                  value={broadcastTurmaId}
                  onChange={(e) => setBroadcastTurmaId(e.target.value)}
                  required
                >
                  <option value="">Seleccione uma turma...</option>
                  {turmas.map(t => (
                    <option key={t.id} value={t.id}>{t.nome} - {t.classe}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>Mensagem a Disparar em Lote</label>
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Exemplo: Estimado(a) encarregado(a), informamos que sexta-feira haverá reunião geral com a direcção da escola às 10h. Contamos com a sua presença."
              required
            />
          </div>

          <div className="sms-info-box" style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="info" size={16} />
              Capacidade do Envio em Lote:
            </strong>
            <p style={{ margin: '6px 0 0' }}>
              O sistema agrupa e despacha todas as mensagens num único pedido de alta velocidade para o gateway Infobip. Mesmo com 50, 100 ou mais encarregados, o envio é processado imediatamente em tempo real.
            </p>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A disparar em lote...' : 'Disparar para Encarregados de Uma Só Vez'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'templates' && (
        <form className="form-page sms-templates-form" onSubmit={handleSaveTemplates}>
          <h3>Personalização de Modelos de SMS</h3>
          <p className="muted">
            Configure o texto padrão das notificações enviadas aos encarregados de educação. Pode utilizar as tags automáticas:
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
            <label>Modelo de Mensagem para Falta Escolar (FALTA)</label>
            <textarea
              rows={3}
              value={templates.FALTA}
              onChange={(e) => setTemplates({ ...templates, FALTA: e.target.value })}
              required
            />
          </div>

          <div className="template-field" style={{ marginTop: '16px' }}>
            <label>Modelo de Mensagem para Limite de Faltas (PPF)</label>
            <textarea
              rows={3}
              value={templates.PPF}
              onChange={(e) => setTemplates({ ...templates, PPF: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'A guardar...' : 'Guardar Modelos de Mensagem'}
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
