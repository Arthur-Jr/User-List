const { insertManyCnpjModel, getAllCnpjModel } = require('../msc-layers/models/cnpj.model');
const { insertManyCpfModel, getAllCpfModel } = require('../msc-layers/models/cpf.model');

const cpfCnpjListMock = {
  cpf: [
    { cpf: '24795932077', blockListed: false },
    { cpf: '27955149076', blockListed: true },
    { cpf: '44670675079', blockListed: false },
    { cpf: '83701906009', blockListed: true },
    { cpf: '65459274001', blockListed: false },
    { cpf: '19011164091', blockListed: true },
  ],
  cnpj: [
    { cnpj: '80739674000141', blockListed: true },
    { cnpj: '78556640000170', blockListed: false },
    { cnpj: '09685028000184', blockListed: true },
    { cnpj: '80026642000107', blockListed: false },
    { cnpj: '97384662000144', blockListed: true },
  ],
};

const insertOnStart = async () => {
  const cnpjList = await getAllCnpjModel();
  const cpfList = await getAllCpfModel();

  if (cnpjList.length === 0 || cpfList.length === 0) {
    await insertManyCpfModel(cpfCnpjListMock.cpf);
    await insertManyCnpjModel(cpfCnpjListMock.cnpj);
  }
};

module.exports = insertOnStart;
