import axios from 'axios';

const URL = 'http://localhost:3001/';

const removeCpfCnpj = async (id, endPoint) => {
  try {
    const { data } = await axios.delete(`${URL}${endPoint}/${id}`);
    return data.message;
  } catch (error) {
    return error.response.data.message;
  }
};

export default removeCpfCnpj;
