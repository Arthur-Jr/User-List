const { incrementReqCountModel } = require('../msc-layers/models/serverStatus.Model');

module.exports = async (_req, _res, next) => {
  await incrementReqCountModel();
  next();
};
