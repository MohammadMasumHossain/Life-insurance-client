
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://life-insurance-server-three.vercel.app',
  withCredentials: true,
});

export default axiosInstance;
