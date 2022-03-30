import axios from 'axios';

const URL = 'http://localhost:3001/';

const editCpfCnpj = async (status, id, endPoint) => {
  try {
    const { data } = await axios.put(`${URL}${endPoint}/${id}`, { blockListed: status });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export default editCpfCnpj;
