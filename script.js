// Main script for HECO-Africa Shop
const products = [
  { id:1, name:"kaftan shirt", category:"kaftan shirt", price:2500, image:"images/Dad 1.jpg", rating:4, isNew:true },
  { id:2, name:"Kaftan shirt", category:"Kaftan shirt", price:2500, image:"images/dad 2.jpg", rating:5, isNew:true },
  { id:3, name:"west african dress", category:"Ankara", price:7500, image:"images/martin 3.jpg", rating:4 },
  { id:4, name:"kids west african shirt", category:"Ankara", price:1500, image:"images/martin 2.jpg", rating:3 },
  { id:5, name:"west african kitenge", category:"Casual", price:4500, image:"images/mama 2.jpg", rating:4 },
  { id:6, name:"Dress", category:"dress", price:7500, image:"images/mama 1.jpg", rating:3 },
  { id:7, name:"Blue Agbada Jacket", category:"Agbada", price:2500, image:"images/dad 50.jpg", rating:5 },
  { id:8, name:"baubaus", category:"Baubaus", price:4500, image:"images/dera 1.jpg", rating:4 },
  { id:9, name:"Blouse", category:"Blouse", price:7500, image:"images/Heco1.2.jpg", rating:4 },
  { id:10, name:"Baubau", category:"Baubaus", price:4500, image:"images/dera 2.jpg", rating:5 },
   { id:10, name:"kaftan shirt", category:"Kaftan shirt", price:2500, image:"images/osore.jpg", rating:5 },
   { id:10, name:"Agbada", category:"Agbada for kids", price:12000, image:"images/agbada.jpg", rating:5 },
   { id:10, name:"Temple Ties", category:"Temple Ties", price:1000, image:"images/ties.jpg", rating:5 },
   { id:10, name:"kitenge Court", category:"kitenge court", price:7000, image:"images/court luder.jpg", rating:5 },
   { id:10, name:"Hoodey", category:"Hoodey", price:3000, image:"images/red hoodey.jpg", rating:5 },
];

let cart = JSON.parse(localStorage.getItem('st_cart') || '[]');
let filteredProducts = [...products];

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCart();
  setupSearch();
  setupFilters();
  setupCartControls();
  setupMobileMenu();
});

// Save cart
function saveCart() {
  localStorage.setItem('st_cart', JSON.stringify(cart));
}

// Render product cards
function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${p.image}" alt="${p.name}">
        ${p.isNew ? '<div class="badge">NEW</div>' : ''}
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
      else renderProducts(products.filter(p => p.category === cat));
    });
  });
}

// Sidebar controls
function setupCartControls() {
  const sidebar = document.getElementById("cart-sidebar");
  document.getElementById("cart-btn").addEventListener("click", () => sidebar.classList.add("open"));
  document.getElementById("close-cart").addEventListener("click", () => sidebar.classList.remove("open"));
}

// Mobile menu
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("goatNav");

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Expose functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;












