const { INTERNAL } = require('../utils/http_code_status');

// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  console.log(err.message);

  // Trata o erro esperado:
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  // Trata o erro inesperado:
  return res.status(INTERNAL).json({ message: 'Internal Server Error' });
};
