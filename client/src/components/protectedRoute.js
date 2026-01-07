import { auth } from '../context/auth.context.js';

export const protectPage = () => {
  if (!auth.isLoggedIn()) {
    window.location.href = '/pages/login.html';
  }
};
