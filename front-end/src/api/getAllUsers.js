import axios from 'axios';

const URL = process.env.REACT_APP_BACK_ENDPOINT || 'http://localhost:3001';

const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${URL}/user-list`);
    return data;
  } catch (error) {
    return [];
  }
};

export default getAllUsers;
