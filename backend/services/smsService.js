import { query } from '../config/db.js';

let smsTemplates = {
  FALTA: 'Estimado(a) Sr(a). {encarregado}, informamos que o(a) estudante {aluno} registou FALTA na aula de {disciplina} (Turma {turma}) no dia {data}. StudentControl',
  PPF: 'URGENTE: Estimado(a) Sr(a). {encarregado}, o(a) estudante {aluno} atingiu o limite de {faltas} faltas não justificadas na disciplina de {disciplina} (PPF). Compareça à secretaria da escola. StudentControl',
  GERAL: 'Estimado(a) Sr(a). {encarregado}, {mensagem}. StudentControl'
};

export function getSmsConfig() {
  return {
    mode: process.env.SMS_MODE || 'simulation',
    apiKey: process.env.SMS_API_KEY ? `${process.env.SMS_API_KEY.slice(0, 8)}...` : null,
    baseUrl: process.env.INFOBIP_BASE_URL || 'https://api.infobip.com',
    sender: process.env.SMS_SENDER || 'StudentCtrl',
    templates: smsTemplates
  };
}

export function updateSmsTemplates(newTemplates = {}) {
  if (newTemplates.FALTA) smsTemplates.FALTA = newTemplates.FALTA.trim();
  if (newTemplates.PPF) smsTemplates.PPF = newTemplates.PPF.trim();
  if (newTemplates.GERAL) smsTemplates.GERAL = newTemplates.GERAL.trim();
  return smsTemplates;
}

export function formatSmsTemplate(template, data = {}) {
  let text = template || '';
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`\\{${key}\\}`, 'gi');
    text = text.replace(placeholder, value !== undefined && value !== null ? String(value) : '');
  }
  return text;
}

export function cleanPhoneNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('258')) return digits;
  if (digits.length === 9) return `258${digits}`;
  return digits;
}

export async function dispatchSms({ destinatario, mensagem }) {
  const mode = process.env.SMS_MODE || 'simulation';
  const cleanTo = cleanPhoneNumber(destinatario);
  const sender = process.env.SMS_SENDER;

  if (mode === 'simulation') {
    console.log(`[SMS SIMULAÇÃO] Para: +${cleanTo} | De: ${sender || 'Padrão'} | Mensagem: "${mensagem}"`);
    return {
      success: true,
      simulated: true,
      detail: 'Modo de simulação ativo. O log foi gerado no servidor mas nenhuma SMS real foi disparada para o celular.'
    };
  }

  const apiKey = process.env.SMS_API_KEY;
  let baseUrl = process.env.INFOBIP_BASE_URL || 'https://api.infobip.com';
  baseUrl = baseUrl.replace(/\/+$/, '');

  if (!apiKey) {
    console.warn('[SMS API] SMS_API_KEY não configurada no .env. Fallback para simulação.');
    return {
      success: true,
      simulated: true,
      detail: 'Chave de API não configurada. O envio foi simulado.'
    };
  }

  try {
    const msgObj = {
      destinations: [{ to: cleanTo }],
      text: mensagem
    };

    if (sender && sender.trim() !== '') {
      msgObj.from = sender.trim();
    }

    const response = await fetch(`${baseUrl}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        'Authorization': `App ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ messages: [msgObj] })
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.ok) {
      const firstMsg = responseData?.messages?.[0];
      const statusGroup = firstMsg?.status?.groupName;
      const statusName = firstMsg?.status?.name;
      const statusDesc = firstMsg?.status?.description;

      if (statusGroup === 'REJECTED' || statusGroup === 'UNDELIVERABLE') {
        console.error(`[SMS INFOBIP REJEITADO] Para: +${cleanTo} | Status: ${statusName} - ${statusDesc}`);
        return {
          success: false,
          error: `Infobip Rejeitado: ${statusDesc || statusName || 'Mensagem rejeitada pela operadora/gateway'}`,
          statusName,
          statusDescription: statusDesc,
          data: responseData,
          status: response.status
        };
      }

      console.log(`[SMS INFOBIP ENVIADO] Para: +${cleanTo} | Status HTTP: ${response.status} | Status Infobip: ${statusName}`);
      return {
        success: true,
        simulated: false,
        messageId: firstMsg?.messageId,
        statusName: statusName || 'PENDING_ACCEPTED',
        statusDescription: statusDesc || 'Mensagem enviada para a gateway Infobip.',
        data: responseData
      };
    }

    const errorDetail = responseData?.requestError?.serviceException?.text || responseData?.errorMessage || responseData?.message || `Erro HTTP ${response.status}`;
    console.error(`[SMS INFOBIP ERRO] HTTP ${response.status}:`, JSON.stringify(responseData));
    return {
      success: false,
      error: `Erro Infobip (${response.status}): ${errorDetail}`,
      data: responseData,
      status: response.status
    };
  } catch (error) {
    console.error('[SMS INFOBIP EXCEÇÃO]:', error.message);
    return { success: false, error: `Exceção de Conexão: ${error.message}` };
  }
}

export async function sendTestSms({ destinatario, mensagem }) {
  const text = mensagem || 'Teste de disparo de SMS do sistema StudentControl - Gestão de Assiduidade.';
  const dispatchResult = await dispatchSms({ destinatario, mensagem: text });

  const estado = dispatchResult.success ? 'ENVIADO' : 'FALHOU';
  const result = await query(
    `INSERT INTO notificacoes (encarregado_id, tipo, destinatario, mensagem, estado)
     VALUES (NULL, 'FALTA', :destinatario, :mensagem, :estado)`,
    { destinatario, mensagem: text, estado }
  );

  return { id: result.insertId, estado, dispatchResult };
}

export async function createNotification({ encarregadoId, tipo, destinatario, mensagem }) {
  const dispatchResult = await dispatchSms({ destinatario, mensagem });
  const estado = dispatchResult.success ? 'ENVIADO' : 'FALHOU';

  const result = await query(
    `INSERT INTO notificacoes (encarregado_id, tipo, destinatario, mensagem, estado)
     VALUES (:encarregadoId, :tipo, :destinatario, :mensagem, :estado)`,
    { encarregadoId, tipo, destinatario, mensagem, estado }
  );

  return { id: result.insertId, estado, dispatchResult };
}

export async function notifyStudentGuardians(connection, alunoId, tipo, details = {}) {
  const [guardians] = await connection.execute(
    `SELECT e.id, e.nome, e.telefone
     FROM encarregados e
     JOIN aluno_encarregado ae ON ae.encarregado_id = e.id
     WHERE ae.aluno_id = ? AND e.activo = 1`,
    [alunoId]
  );

  if (!guardians || guardians.length === 0) return;

  const [[studentInfo]] = await connection.execute(
    `SELECT al.nome AS aluno, t.nome AS turma
     FROM alunos al
     LEFT JOIN turmas t ON t.id = al.turma_id
     WHERE al.id = ?`,
    [alunoId]
  );

  const rawMessage = typeof details === 'string' ? details : (smsTemplates[tipo] || smsTemplates.FALTA);

  for (const guardian of guardians) {
    const contextData = {
      encarregado: guardian.nome || 'Encarregado(a)',
      aluno: studentInfo?.aluno || 'Estudante',
      turma: studentInfo?.turma || '',
      disciplina: details.disciplina || 'Disciplina',
      data: details.data || new Date().toISOString().slice(0, 10),
      faltas: details.faltas || '',
      mensagem: typeof details === 'string' ? details : ''
    };

    const formattedMessage = typeof details === 'string'
      ? details
      : formatSmsTemplate(rawMessage, contextData);

    const dispatchResult = await dispatchSms({ destinatario: guardian.telefone, mensagem: formattedMessage });
    const estado = dispatchResult.success ? 'ENVIADO' : 'FALHOU';

    await connection.execute(
      `INSERT INTO notificacoes (encarregado_id, tipo, destinatario, mensagem, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [guardian.id, tipo, guardian.telefone, formattedMessage, estado]
    );
  }
}
