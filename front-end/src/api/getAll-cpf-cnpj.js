import axios from 'axios';

import sortList from '../utils/sortList';

const URL = 'http://localhost:3001/';

const getAllCpfCnpj = async () => {
  try {
    const { data: { cpf, cnpj } } = await axios.get(`${URL}cpf-cnpj-lists`);
    return { cpf: sortList(cpf, 'cpf'), cnpj: sortList(cnpj, 'cnpj') };
  } catch (error) {
    return { cpf: [], cnpj: [] };
  }
};

export default getAllCpfCnpj;
