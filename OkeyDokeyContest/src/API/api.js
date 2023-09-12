import axios from 'axios';

const API = axios.create({
  baseURL: 'https://www.okdkkiosk.shop/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default API;
