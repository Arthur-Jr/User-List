const getTimeDiff = require('../../utils/getTimeDiff');
const {
  setServerStatusModel,
  getServerStatusModel,
} = require('../models/serverStatus.Model');

const setServerStatusService = async (date) => setServerStatusModel(date);

const getServerStatusService = async () => {
  const { startDate, reqCount } = await getServerStatusModel();
  const oldDate = new Date(startDate);
  const newDate = new Date();
  const upTime = getTimeDiff(oldDate, newDate); /* Em horas, minutos e segundos */

  return { upTime, reqCount };
};

module.exports = {
  setServerStatusService,
  getServerStatusService,
};
