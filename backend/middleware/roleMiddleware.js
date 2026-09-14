export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.perfil)) {
      return res.status(403).json({ message: 'Nao tem permissao para realizar esta operacao.' });
    }
    return next();
  };
}
