import axios from 'axios';

const instance = axios.create({
  baseURL: '', // Use proxy - requests will go through Vite dev server
  withCredentials: true, // Important: Send cookies with requests
});

export default instance;
