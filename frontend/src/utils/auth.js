export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // hapus header global axios kalau ada
  delete window.axios?.defaults?.headers?.common?.Authorization;
};