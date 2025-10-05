// TechStore - Product data (kept small, images via picsum for demo)
window.Products = (function () {
  const items = [
    { id: 1, name: 'Nova X Smartphone', price: 799, category: 'smartphones', rating: 4.6, image: 'https://picsum.photos/seed/phone1/640/480' },
    { id: 2, name: 'AeroBook Pro 14', price: 1299, category: 'laptops', rating: 4.7, image: 'https://picsum.photos/seed/laptop1/640/480' },
    { id: 3, name: 'Quantum Buds', price: 149, category: 'accessories', rating: 4.4, image: 'https://picsum.photos/seed/earbuds/640/480' },
    { id: 4, name: 'HyperPad 11', price: 599, category: 'accessories', rating: 4.5, image: 'https://picsum.photos/seed/tablet/640/480' },
    { id: 5, name: 'Falcon Gaming Headset', price: 119, category: 'gaming', rating: 4.3, image: 'https://picsum.photos/seed/headset/640/480' },
    { id: 6, name: 'Vortex Mechanical Keyboard', price: 159, category: 'gaming', rating: 4.6, image: 'https://picsum.photos/seed/keyboard/640/480' },
    { id: 7, name: 'Photon 65W Charger', price: 39, category: 'accessories', rating: 4.2, image: 'https://picsum.photos/seed/charger/640/480' },
    { id: 8, name: 'ZenBook Air 13', price: 999, category: 'laptops', rating: 4.5, image: 'https://picsum.photos/seed/laptop2/640/480' },
    { id: 9, name: 'Aurora Max Smartphone', price: 1099, category: 'smartphones', rating: 4.8, image: 'https://picsum.photos/seed/phone2/640/480' },
    { id: 10, name: 'Nebula Gaming Mouse', price: 59, category: 'gaming', rating: 4.4, image: 'https://picsum.photos/seed/mouse/640/480' },
    { id: 11, name: 'Titan Pro 15', price: 1599, category: 'laptops', rating: 4.9, image: 'https://picsum.photos/seed/laptop3/640/480' },
    { id: 12, name: 'Flux Wireless Charger', price: 49, category: 'accessories', rating: 4.1, image: 'https://picsum.photos/seed/wireless/640/480' }
  ];
  return { all: () => items.slice(), byCategory: (c) => c === 'all' ? items : items.filter(i => i.category === c) };
})();
