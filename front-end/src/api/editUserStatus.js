import axios from 'axios';

const URL = 'http://localhost:3001';

const editUser = async (status, id) => {
  try {
    const { data } = await axios.put(`${URL}/user-list/${id}`, { blockListed: status });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export default editUser;
