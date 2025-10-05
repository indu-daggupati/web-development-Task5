// TechStore - Main interactions and rendering
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Toast
  const toast = (msg) => {
    const el = $('#toast');
    $('.toast-message', el).textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2200);
  };
  window.showToast = toast;

  // Loading screen
  window.addEventListener('load', () => {
    const l = $('#loading-screen');
    if (l) l.style.display = 'none';
  });

  // Back to top
  const backTop = $('#back-to-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    backTop.classList.toggle('show', y > 400);
  });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile nav toggle
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');
  navToggle.addEventListener('click', () => navMenu.classList.toggle('show'));

  // Smooth scroll for nav links
  $$('.nav-link').forEach(a => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      $(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      $$('.nav-link').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
      navMenu.classList.remove('show');
    }
  }));

  // Data & state
  const PAGE_SIZE = 8;
  let currentFilter = 'all';
  let currentPage = 1;
  let searchTerm = '';

  // Rendering products
  const grid = $('#products-grid');
  const renderCards = (items) => {
    const frag = document.createDocumentFragment();
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-media">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-body">
          <h3 class="product-title">${p.name}</h3>
          <div class="product-meta">
            <span>⭐ ${p.rating.toFixed(1)}</span>
            <span class="price">$${p.price.toFixed(2)}</span>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn btn-outline add-btn" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
          <button class="btn btn-secondary details-btn" data-id="${p.id}">Details</button>
        </div>`;
      frag.appendChild(card);
    });
    grid.innerHTML = '';
    grid.appendChild(frag);
    bindCardEvents();
  };

  const paginate = (arr, page, size) => arr.slice(0, page * size);

  const applyFilters = () => {
    const base = Products.byCategory(currentFilter);
    const filtered = searchTerm
      ? base.filter(p => p.name.toLowerCase().includes(searchTerm))
      : base;
    const items = paginate(filtered, currentPage, PAGE_SIZE);
    renderCards(items);
    $('#load-more-btn').style.display = items.length < filtered.length ? 'inline-flex' : 'none';
  };

  // Filters
  $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    applyFilters();
  }));

  // Load more
  $('#load-more-btn').addEventListener('click', () => { currentPage++; applyFilters(); });

  // Search
  const searchInput = $('#search-input');
  $('#search-btn').addEventListener('click', () => { searchTerm = searchInput.value.trim().toLowerCase(); currentPage = 1; applyFilters(); });
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#search-btn').click(); }});

  // Shop now
  $('#shop-now-btn').addEventListener('click', () => $('#products').scrollIntoView({ behavior: 'smooth' }));

  // Auth modal
  const authBtn = $('#auth-btn');
  const authModal = $('#auth-modal');
  const authClose = $('#auth-close');
  const authForm = $('#auth-form');
  const authTitle = $('#auth-title');
  const authSubmit = $('#auth-submit');
  const switchLink = $('#auth-switch-link');
  let mode = 'login';

  const updateAuthUI = () => {
    const user = Auth.get();
    if (user) {
      authBtn.querySelector('span').textContent = user.email.split('@')[0];
      authBtn.title = 'Click to logout';
    } else {
      authBtn.querySelector('span').textContent = 'Login';
      authBtn.removeAttribute('title');
    }
  };

  authBtn.addEventListener('click', () => {
    const user = Auth.get();
    if (user) { Auth.logout(); toast('Logged out'); updateAuthUI(); }
    else { authModal.classList.add('show'); }
  });
  authClose.addEventListener('click', () => authModal.classList.remove('show'));
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    mode = mode === 'login' ? 'signup' : 'login';
    authTitle.textContent = mode === 'login' ? 'Login' : 'Sign up';
    $('#confirm-password-group').style.display = mode === 'signup' ? 'block' : 'none';
    authSubmit.textContent = mode === 'login' ? 'Login' : 'Create Account';
  });
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#auth-email').value.trim();
    const pwd = $('#auth-password').value.trim();
    if (!email || !pwd) { toast('Please fill in all fields'); return; }
    Auth.login(email);
    authModal.classList.remove('show');
    toast('Welcome to TechStore!');
    updateAuthUI();
  });

  // Cart modal
  const cartBtn = $('#cart-btn');
  const cartModal = $('#cart-modal');
  const cartClose = $('#cart-close');
  const clearBtn = $('#clear-cart');
  const checkoutBtn = $('#checkout-btn');
  const cartItems = $('#cart-items');
  const cartTotalEl = $('#cart-total');
  const cartCountEl = $('#cart-count');

  const renderCart = () => {
    const cart = Cart.read();
    cartItems.innerHTML = '';
    if (!cart.length) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <img src="${item.image}" alt="${item.name}" width="64" height="48" loading="lazy">
          <div>
            <div><strong>${item.name}</strong></div>
            <div class="muted">$${item.price.toFixed(2)} × ${item.qty}</div>
          </div>
          <button class="btn btn-outline" data-remove="${item.id}">Remove</button>
        `;
        cartItems.appendChild(row);
      });
    }
    cartTotalEl.textContent = Cart.total().toFixed(2);
    cartCountEl.textContent = Cart.count();
  };

  const bindCardEvents = () => {
    $$('.add-btn', grid).forEach(b => b.addEventListener('click', () => {
      const id = Number(b.dataset.id);
      const product = Products.all().find(p => p.id === id);
      Cart.add(product);
      renderCart();
      toast('Added to cart');
    }));
    $$('.details-btn', grid).forEach(b => b.addEventListener('click', () => {
      toast('Product details coming soon');
    }));
  };

  cartBtn.addEventListener('click', () => { renderCart(); cartModal.classList.add('show'); });
  cartClose.addEventListener('click', () => cartModal.classList.remove('show'));
  clearBtn.addEventListener('click', () => { Cart.clear(); renderCart(); toast('Cart cleared'); });
  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-remove]');
    if (btn) { Cart.remove(Number(btn.dataset.remove)); renderCart(); toast('Removed item'); }
  });
  checkoutBtn.addEventListener('click', () => { toast('Checkout simulated. Thank you!'); Cart.clear(); renderCart(); });

  // Initial render
  updateAuthUI();
  applyFilters();
})();
