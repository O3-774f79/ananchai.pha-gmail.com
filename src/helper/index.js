import axios from 'axios';
export default axios.create({
  baseURL: `http://52.163.210.101:44000/`,
  // baseURL: `http://localhost:44000/`,
  // headers: {'x-access-token': localStorage.getItem('token')}
});