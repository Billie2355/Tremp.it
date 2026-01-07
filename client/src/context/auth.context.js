export const auth = {
    get token() {
      return localStorage.getItem('token');
    },
  
    setToken(token) {
      localStorage.setItem('token', token);
    },
  
    logout() {
      localStorage.removeItem('token');
      window.location.href = '/pages/login.html';
    },
  
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  };
  