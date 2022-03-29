import axios from 'axios';

const registerData = async (body, endPoint) => {
  try {
    await axios.post(`http://localhost:3001/${endPoint}`, body);
    return `${endPoint.toUpperCase()} registrado com sucesso`;
  } catch (error) {
    return error.response.data.message;
  }
};

export default registerData;
