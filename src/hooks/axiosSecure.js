import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000', // change to your actual backend URL
  withCredentials: false, // if using cookies for auth
});

export default axiosSecure;
