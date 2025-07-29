
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://life-insurance-server-three.vercel.app',
  withCredentials: false,
});

export default axiosInstance;
