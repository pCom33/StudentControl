import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredPaths = [
  ['backend dependencies', join(root, 'backend', 'node_modules')],
  ['frontend dependencies', join(root, 'frontend', 'node_modules')],
  ['backend .env', join(root, 'backend', '.env')],
  ['frontend .env', join(root, 'frontend', '.env')]
];

const missing = requiredPaths.filter(([, path]) => !existsSync(path));

if (missing.length > 0) {
  console.log('StudentControl ainda precisa destes ficheiros/pastas:');
  for (const [label] of missing) {
    console.log(`- ${label}`);
  }
  console.log('');
  console.log('Executa primeiro:');
  console.log('cd backend && npm install');
  console.log('cd ../frontend && npm install');
  console.log('Depois volta para D:\\StudentControl e executa npm start.');
  process.exit(1);
}

function run(label, command, cwd) {
  const child = spawn('cmd.exe', ['/d', '/s', '/c', command], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => process.stdout.write(`[${label}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${label}] ${data}`));
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${label}] terminou com codigo ${code}`);
    }
  });

  return child;
}

console.log('StudentControl a iniciar...');
console.log('Frontend: o Vite vai mostrar a porta local disponivel');
console.log('Backend:  http://127.0.0.1:4000/api');
console.log('');

const backend = run('backend', 'npm.cmd run dev', join(root, 'backend'));
const frontend = run('frontend', 'npm.cmd run dev -- --host 127.0.0.1 --port 5173', join(root, 'frontend'));

function shutdown() {
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
