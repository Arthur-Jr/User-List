import axios from 'axios';

const URL = 'http://localhost:3001';

const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${URL}/user-list`);
    return data;
  } catch (error) {
    return [];
  }
};

export default getAllUsers;
