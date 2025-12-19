// Main script for HECO-Africa Shop
const products = [
  { id:1, name:"kaftan shirt", category:"kaftan", price:2500, image:"images/Dad 1.jpg", rating:4, isNew:true },
  { id:10, name:"University gown", category:"university gown", price:35000, image:"images/Agbada 555.jpeg", rating:5, isNew:true },
  { id:10, name:"kenyan bungle", category:"kenyan bungle", price:500, image:"images/bungle.jpg", rating:5, isNew:true },
  { id:11, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 3.jpg", rating:5, isNew:true },
  { id:12, name:"improved kaunda suit", category:"improve kaunda suit", price:11500, image:"images/rto 11500.jpg", rating:5, isNew:true },
  { id:2, name:"Kaftan shirt", category:"Kaftan ", price:2500, image:"images/dad 2.jpg", rating:5, isNew:true },
  { id:3, name:"west african dress", category:"Ankara", price:7500, image:"images/martin 3.jpg", rating:4 },
  { id:4, name:"kids west african shirt", category:"Ankara", price:1500, image:"images/martin 2.jpg", rating:3 },
  { id:13, name:"Agbada", category:"Agbada", price:15000, image:"images/green.jpg", rating:3 },
  { id:14, name:"university gown", category:"university gown", price:15000, image:"images/gown 1.jpg", rating:3 },
  { id:5, name:"west african kitenge", category:"Casual", price:4500, image:"images/mama 2.jpg", rating:4 },
  { id:6, name:"Dress", category:"dress", price:7500, image:"images/mama 1.jpg", rating:3 },
  { id:7, name:"Kaftan", category:"Kaftan", price:2500, image:"images/dad 50.jpg", rating:5 },
  { id:15, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 7.jpg", rating:5 },
  { id:16, name:"University gowns", category:"university gowns", price:15000, image:"images/gown 2.jpg", rating:3 },
  { id:8, name:"baubaus", category:"Baubaus", price:4500, image:"images/dera 1.jpg", rating:4 },
  { id:9, name:"Blouse", category:"Blouse", price:7500, image:"images/Heco1.2.jpg", rating:4 },
  { id:17, name:"Baubau", category:"Baubaus", price:4500, image:"images/dera 2.jpg", rating:5 },
  { id:18, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 6.jpg", rating:5 },
  { id:19, name:"kaftan shirt", category:"Kaftan ", price:2500, image:"images/osore.jpg", rating:5 },
  { id:20, name:"Agbada", category:"Agbada for kids", price:12000, image:"images/agbada.jpg", rating:5 },
  { id:21, name:"Temple Ties", category:"Temple Ties", price:1000, image:"images/ties.jpg", rating:5 },
  { id:22, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 4.jpg", rating:5 },
  { id:23, name:"kitenge Court", category:"kitenge court", price:7000, image:"images/court luder.jpg", rating:5 },
  { id:24, name:"Hoodey", category:"Hoodey", price:3000, image:"images/red hoodey.jpg", rating:5 },
];

let cart = JSON.parse(localStorage.getItem('st_cart') || '[]');
let likes = JSON.parse(localStorage.getItem('st_likes') || '[]');

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCart();
  setupSearch();
  setupFilters();
  setupCartControls();
  setupMobileMenu();
  setupFloatingSearch();
});

// Save cart
function saveCart() {
  localStorage.setItem('st_cart', JSON.stringify(cart));
}

// Save likes
function saveLikes() {
  localStorage.setItem('st_likes', JSON.stringify(likes));
}

// Render product cards WITH LIKE BUTTON
function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    const isLiked = likes.includes(p.id);

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${p.image}" alt="${p.name}">
        ${p.isNew ? '<div class="badge">NEW</div>' : ''}
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${p.id})">
          ${isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <div class="rating">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
        <div class="price">KES ${p.price}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to cart</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Toggle like
function toggleLike(id) {
  const index = likes.indexOf(id);
  if (index > -1) {
    likes.splice(index, 1);
  } else {
    likes.push(id);
  }
  saveLikes();
  
  // Update the like button
  const likeBtn = document.querySelector(`button[onclick="toggleLike(${id})"]`);
  if (likeBtn) {
    const isLiked = likes.includes(id);
    likeBtn.classList.toggle('liked', isLiked);
    likeBtn.innerHTML = isLiked ? '❤️' : '🤍';
  }
}

// Add to cart
function addToCart(id) {
  const item = cart.find(i => i.id === id);

  if (item) item.quantity++;
  else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCart();
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCart();
}

// Update cart UI
function updateCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  countEl.textContent = cart.reduce((t, i) => t + i.quantity, 0);

  itemsEl.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        Qty: ${item.quantity}
      </div>
      <div style="text-align:right">
        KES ${item.price * item.quantity}<br>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;

    itemsEl.appendChild(div);
  });

  totalEl.textContent = `KES ${total}`;
}

// Search
function setupSearch() {
  const search = document.getElementById('search');
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    renderProducts(results);
  });
}

// Filters
function setupFilters() {
  document.querySelectorAll("#category-filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      let cat = btn.dataset.cat;
      if (cat === "All") renderProducts(products);
      else {
        const categoryMap = {
          "Kente": "Kaftan",
          "Agbada": "Agbada",
          "Ankara": "Ankara",
          "Casual": "Casual"
        };
        const targetCategory = categoryMap[cat] || cat;
        const results = products.filter(p => p.category === targetCategory);
        renderProducts(results);
      }
    });
  });
}

// Cart controls
function setupCartControls() {
  const sidebar = document.getElementById("cart-sidebar");
  document.getElementById("cart-btn").addEventListener("click", () => sidebar.classList.add("open"));
  document.getElementById("close-cart").addEventListener("click", () => sidebar.classList.remove("open"));
}

// Mobile menu - SLIDES FROM LEFT
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("mobileSidebar");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("closeSidebar");

  btn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Close sidebar when clicking on any link
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
  });
}

// Floating Search Setup
function setupFloatingSearch() {
  const floatingBtn = document.getElementById('floatingSearchBtn');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('closeSearch');

  floatingBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    document.getElementById('search').focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
}

// Expose functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleLike = toggleLike;








