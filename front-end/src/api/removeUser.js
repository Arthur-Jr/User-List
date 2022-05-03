import axios from 'axios';

const URL = 'http://localhost:3001';

const removeUser = async (id) => {
  try {
    const { data } = await axios.delete(`${URL}/user-list/${id}`);
    return data.message;
  } catch (error) {
    return error.response.data.message;
  }
};

export default removeUser;
