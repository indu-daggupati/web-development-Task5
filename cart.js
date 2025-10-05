// TechStore - Cart module (localStorage based)
window.Cart = (function () {
  const KEY = 'techstore_cart_v1';
  const read = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const write = (cart) => localStorage.setItem(KEY, JSON.stringify(cart));

  const add = (item) => {
    const cart = read();
    const found = cart.find(c => c.id === item.id);
    if (found) found.qty += 1; else cart.push({ ...item, qty: 1 });
    write(cart);
    return cart;
  };
  const remove = (id) => { const cart = read().filter(c => c.id !== id); write(cart); return cart; };
  const clear = () => write([]);
  const total = () => read().reduce((s, i) => s + i.price * i.qty, 0);
  const count = () => read().reduce((s, i) => s + i.qty, 0);

  return { read, add, remove, clear, total, count };
})();
