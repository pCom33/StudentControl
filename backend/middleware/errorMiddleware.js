export function errorMiddleware(error, req, res, next) {
  if (!error.status || error.status >= 500) console.error(error);
  if (error?.code === 'ECONNREFUSED') {
    return res.status(503).json({
      message: 'Nao foi possivel estabelecer ligacao ao MySQL. Confirme se o MySQL do XAMPP esta iniciado.'
    });
  }
  return res.status(error.status || 500).json({
    message: error.message || 'Nao foi possivel concluir a operacao. Tente novamente.'
  });
}
