// TechStore - Fake Auth (localStorage)
window.Auth = (function () {
  const KEY = 'techstore_user_v1';
  const get = () => JSON.parse(localStorage.getItem(KEY) || 'null');
  const set = (user) => localStorage.setItem(KEY, JSON.stringify(user));
  const clear = () => localStorage.removeItem(KEY);

  const login = (email) => { set({ email }); return get(); };
  const logout = () => clear();

  return { get, login, logout };
})();
