import axios from 'axios';

const URL = 'http://localhost:3001/';

const getServerStatus = async () => {
  try {
    const { data: { upTime, reqCount } } = await axios.get(`${URL}status`);
    return `Tempo Online(H/M/S): ${upTime}, Quantidade de consultas: ${reqCount}`;
  } catch (error) {
    return error.response.data.message;
  }
};

export default getServerStatus;
