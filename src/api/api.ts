import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:4444/laf/api/v1',
});


let unauthorizedHandler: () => void = () => {
  localStorage.removeItem('uoxToken');
  window.location.href = '/sign-in';
};


export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('uoxToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
