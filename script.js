// Main script for HECO-Africa Shop
const products = [
  { id:1, name:"kaftan shirt", category:"Kaftan", price:2500, image:"images/Dad 1.jpg", rating:4, isNew:true },
  { id:10, name:"University gown", category:"University", price:35000, image:"images/Agbada 555.jpg", rating:5, isNew:true },
  { id:11, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 3.jpg", rating:5, isNew:true },
  { id:12, name:"improved kaunda suit", category:"Kaunda", price:11500, image:"images/rto 11500.jpg", rating:5, isNew:true },
  { id:2, name:"Kaftan shirt", category:"Kaftan", price:2500, image:"images/dad 2.jpg", rating:5, isNew:true },
  { id:3, name:"west african dress", category:"Ankara", price:7500, image:"images/martin 3.jpg", rating:4 },
  { id:4, name:"kids west african shirt", category:"Ankara", price:1500, image:"images/martin 2.jpg", rating:3 },
  { id:13, name:"Agbada", category:"Agbada", price:15000, image:"images/green.jpg", rating:3 },
  { id:14, name:"university gown", category:"University", price:15000, image:"images/gown 1.jpg", rating:3 },
  { id:5, name:"west african kitenge", category:"Casual", price:4500, image:"images/mama 2.jpg", rating:4 },
  { id:6, name:"Dress", category:"BouBou", price:7500, image:"images/mama 1.jpg", rating:3 },
  { id:7, name:"Kaftan", category:"Kaftan", price:2500, image:"images/dad 50.jpg", rating:5 },
  { id:15, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 7.jpg", rating:5 },
  { id:16, name:"University gowns", category:"University", price:15000, image:"images/gown 2.jpg", rating:3 },
  { id:8, name:"baubaus", category:"BouBou", price:4500, image:"images/dera 1.jpg", rating:4 },
  { id:9, name:"Blouse", category:"Blouse", price:7500, image:"images/Heco1.2.jpg", rating:4 },
  { id:17, name:"Baubau", category:"BouBou", price:4500, image:"images/dera 2.jpg", rating:5 },
  { id:18, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 6.jpg", rating:5 },
  { id:19, name:"kaftan shirt", category:"Kaftan", price:2500, image:"images/osore.jpg", rating:5 },
  { id:20, name:"Agbada", category:"Agbada", price:12000, image:"images/agbada.jpg", rating:5 },
  { id:21, name:"Temple Ties", category:"Accessory", price:1000, image:"images/ties.jpg", rating:5 },
  { id:22, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 4.jpg", rating:5 },
  { id:23, name:"kitenge Court", category:"Casual", price:7000, image:"images/court luder.jpg", rating:5 },
  { id:24, name:"Hoodey", category:"Casual", price:3000, image:"images/red hoodey.jpg", rating:5 },
];

let cart = JSON.parse(localStorage.getItem('st_cart') || '[]');
let likes = JSON.parse(localStorage.getItem('st_likes') || '[]');

document.addEventListener("DOMContentLoaded", () => {
  console.log("HECO-Africa Shop loaded!");
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

// Render product cards
function renderProducts(list) {
  const container = document.getElementById('product-list');
  if (!container) {
    console.error("Product list container not found!");
    return;
  }
  
  container.innerHTML = '';

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    const isLiked = likes.includes(p.id);

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.isNew ? '<div class="badge">NEW</div>' : ''}
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${p.id})">
          ${isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <div class="rating">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
        <div class="price">KES ${p.price.toLocaleString()}</div>
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
  
  // Re-render to update heart icon
  const searchInput = document.getElementById('search');
  if (searchInput && searchInput.value) {
    const q = searchInput.value.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    renderProducts(results);
  } else {
    renderProducts(products);
  }
}

// Add to cart
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  const product = products.find(p => p.id === id);

  if (!product) {
    console.error(`Product with id ${id} not found!`);
    return;
  }

  if (item) {
    item.quantity++;
  } else {
    cart.push({ 
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1 
    });
  }

  saveCart();
  updateCart();
  
  // Show visual feedback
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('pulse');
    setTimeout(() => cartBtn.classList.remove('pulse'), 300);
  }
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

  if (!countEl || !itemsEl || !totalEl) {
    console.error("Cart elements not found!");
    return;
  }

  const totalCount = cart.reduce((t, i) => t + i.quantity, 0);
  countEl.textContent = totalCount;

  itemsEl.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.quantity;

      const div = document.createElement('div');
      div.className = 'cart-item';

      div.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong><br>
          <small>KES ${item.price.toLocaleString()} × ${item.quantity}</small>
        </div>
        <div class="cart-item-actions">
          KES ${(item.price * item.quantity).toLocaleString()}<br>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;

      itemsEl.appendChild(div);
    });
  }

  totalEl.textContent = `KES ${total.toLocaleString()}`;
}

// Search
function setupSearch() {
  const search = document.getElementById('search');
  if (!search) return;
  
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    renderProducts(results);
  });
}

// Filters - FIXED to match your product categories
function setupFilters() {
  const filterButtons = document.querySelectorAll("#category-filters button");
  if (filterButtons.length === 0) {
    console.error("Filter buttons not found!");
    return;
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      let cat = btn.dataset.cat;
      console.log(`Filtering by: ${cat}`);
      
      if (cat === "All") {
        renderProducts(products);
      } else {
        // Map HTML button categories to product categories
        const categoryMap = {
          "Kente": "Kaftan",        // Your HTML says Kente but displays Kaftan
          "Agbada": "Agbada",
          "Ankara": "BouBou",       // Your HTML says Ankara but displays BouBou
          "Casual": "Blouse"        // Your HTML says Casual but displays blouse
        };
        
        const targetCategory = categoryMap[cat] || cat;
        const results = products.filter(p => p.category === targetCategory);
        renderProducts(results);
      }
    });
  });
}

// Sidebar controls
function setupCartControls() {
  const cartBtn = document.getElementById("cart-btn");
  const closeBtn = document.getElementById("close-cart");
  const sidebar = document.getElementById("cart-sidebar");
  
  if (!cartBtn || !closeBtn || !sidebar) {
    console.error("Cart control elements not found!");
    return;
  }
  
  cartBtn.addEventListener("click", () => {
    sidebar.style.display = 'block';
    sidebar.setAttribute('aria-hidden', 'false');
  });
  
  closeBtn.addEventListener("click", () => {
    sidebar.style.display = 'none';
    sidebar.setAttribute('aria-hidden', 'true');
  });
}

// Mobile menu
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("mobileSidebar");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("closeSidebar");

  if (!btn || !sidebar || !overlay || !closeBtn) {
    console.error("Mobile menu elements not found!");
    return;
  }

  btn.addEventListener("click", () => {
    sidebar.style.transform = 'translateX(0)';
    overlay.style.display = 'block';
  });

  closeBtn.addEventListener("click", () => {
    sidebar.style.transform = 'translateX(-100%)';
    overlay.style.display = 'none';
  });

  overlay.addEventListener("click", () => {
    sidebar.style.transform = 'translateX(-100%)';
    overlay.style.display = 'none';
  });
}

// Floating Search Setup
function setupFloatingSearch() {
  const floatingBtn = document.getElementById('floatingSearchBtn');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('closeSearch');

  if (!floatingBtn || !overlay || !closeBtn) {
    console.error("Search elements not found!");
    return;
  }

  floatingBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    document.getElementById('search').focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
    }
  });
}

// Expose functions to global scope
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleLike = toggleLike;


















