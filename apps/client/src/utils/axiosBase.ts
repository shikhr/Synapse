import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000',
});

console.log('Axios base URL:', axiosInstance.defaults.baseURL);
console.log(import.meta.env.VITE_APP_API_URL);

export default axiosInstance;
