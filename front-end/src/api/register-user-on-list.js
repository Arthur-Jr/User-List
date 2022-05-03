import axios from 'axios';

const URL = process.env.REACT_APP_BACK_ENDPOINT || 'http://localhost:3001';

const registerData = async (body, endPoint) => {
  try {
    await axios.post(`${URL}/user-list/${endPoint}`, body);
    return `${endPoint} registrado com sucesso`;
  } catch (error) {
    return error.response.data.message;
  }
};

export default registerData;
