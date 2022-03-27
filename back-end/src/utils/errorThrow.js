module.exports = (statusCode, message) => {
  const err = new Error(message);
  err.status = statusCode;
  err.message = message;
  throw err;
};
