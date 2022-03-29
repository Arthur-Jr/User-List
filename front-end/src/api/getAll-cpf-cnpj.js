import axios from 'axios';

const URL = 'http://localhost:3001/';

const getAllCpfCnpj = async () => {
  try {
    const { data } = await axios.get(`${URL}cpf-cnpj-lists`);
    return data;
  } catch (error) {
    return { cpf: [], cnpj: [] };
  }
};

export default getAllCpfCnpj;
