import { apiRequest } from './api.js';

export const login = (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const signup = (data) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getMe = () => {
  return apiRequest('/users/me');
};
