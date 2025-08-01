import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Flask runs on 5000
  withCredentials: true,             // if you're using cookies
});

export default api;
