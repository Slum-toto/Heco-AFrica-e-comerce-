// Main script for HECO-Africa Shop
const products = [
  { id:1, name:"kaftan shirt", category:"Kaftan", price:2500, image:"images/Dad 1.jpg", rating:4, isNew:true },
  { id:2, name:"Kaftan shirt", category:"Kaftan", price:2500, image:"images/dad 2.jpg", rating:5, isNew:true },
  { id:3, name:"west african dress", category:"Ankara", price:7500, image:"images/martin 3.jpg", rating:4 },
  { id:4, name:"kids west african shirt", category:"Ankara", price:1500, image:"images/martin 2.jpg", rating:3 },
  { id:5, name:"west african kitenge", category:"Casual", price:4500, image:"images/mama 2.jpg", rating:4 },
  { id:6, name:"Dress", category:"BouBou", price:7500, image:"images/mama 1.jpg", rating:3 },
  { id:7, name:"Kaftan", category:"Kaftan", price:2500, image:"images/dad 50.jpg", rating:5 },
  { id:8, name:"baubaus", category:"BouBou", price:4500, image:"images/dera 1.jpg", rating:4 },
  { id:9, name:"Blouse", category:"Blouse", price:7500, image:"images/Heco1.2.jpg", rating:4 },
  { id:10, name:"University gown", category:"University", price:35000, image:"images/Agbada 555.jpg", rating:5, isNew:true },
  { id:11, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 3.jpg", rating:5, isNew:true },
  { id:12, name:"improved kaunda suit", category:"Kaunda", price:11500, image:"images/rto 11500.jpg", rating:5, isNew:true },
  { id:13, name:"Agbada", category:"Agbada", price:15000, image:"images/green.jpg", rating:3 },
  { id:14, name:"university gown", category:"University", price:15000, image:"images/gown 1.jpg", rating:3 },
  { id:15, name:"Agbada", category:"Agbada", price:35000, image:"images/agbada 7.jpg", rating:5 },
  { id:16, name:"University gowns", category:"University", price:15000, image:"images/gown 2.jpg", rating:3 },
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
  
  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; margin: 20px 0;">
        <h3 style="color: #666; margin-bottom: 10px;">No products found</h3>
        <p style="color: #888;">Try a different search or category</p>
      </div>
    `;
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
  
  // Update like button visually
  const likeBtn = document.querySelector(`button[onclick="toggleLike(${id})"]`);
  if (likeBtn) {
    const isLiked = likes.includes(id);
    likeBtn.classList.toggle('liked', isLiked);
    likeBtn.innerHTML = isLiked ? '❤️' : '🤍';
  }
}

// Add to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) {
    console.error(`Product with id ${id} not found!`);
    return;
  }

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
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
  
  // Visual feedback
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('pulse');
    setTimeout(() => cartBtn.classList.remove('pulse'), 300);
  }
  
  // Show cart sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('cart-sidebar').classList.add('open');
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

  if (!countEl || !itemsEl || !totalEl) return;

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
          <strong>${item.name}</strong>
          <small>KES ${item.price.toLocaleString()} × ${item.quantity}</small>
        </div>
        <div class="cart-item-actions">
          <div>KES ${(item.price * item.quantity).toLocaleString()}</div>
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
    const q = search.value.toLowerCase().trim();
    if (q === '') {
      renderProducts(products);
      return;
    }
    
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
    renderProducts(results);
  });
}

// Filters - SIMPLIFIED - Now matches exactly
function setupFilters() {
  const filterButtons = document.querySelectorAll("#category-filters button");
  if (filterButtons.length === 0) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const category = this.dataset.cat;
      
      if (category === "All") {
        renderProducts(products);
      } else {
        const results = products.filter(p => p.category === category);
        renderProducts(results);
      }
    });
  });
}

// Cart controls
function setupCartControls() {
  const cartBtn = document.getElementById("cart-btn");
  const closeBtn = document.getElementById("close-cart");
  const sidebar = document.getElementById("cart-sidebar");
  
  if (!cartBtn || !closeBtn || !sidebar) return;
  
  cartBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
  });
  
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
  
  // Close cart when clicking outside on mobile
  sidebar.addEventListener('click', (e) => {
    if (e.target === sidebar) {
      sidebar.classList.remove('open');
    }
  });
}

// Mobile menu
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("mobileSidebar");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("closeSidebar");

  if (!btn || !sidebar || !overlay || !closeBtn) return;

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
}

// Floating Search
function setupFloatingSearch() {
  const floatingBtn = document.getElementById('floatingSearchBtn');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('closeSearch');

  if (!floatingBtn || !overlay || !closeBtn) return;

  floatingBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    document.getElementById('search').focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    document.getElementById('search').value = '';
    renderProducts(products);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.getElementById('search').value = '';
      renderProducts(products);
    }
  });
}

// Global functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleLike = toggleLike;











