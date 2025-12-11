


// Main script for HECO-Africa Shop
const products = [
  { id: 1, name: "kaftan shirt", category: "Kaftan", price: 2500, image: "images/Dad 1.jpg", rating: 4, isNew: true },
  { id: 2, name: "Kaftan shirt", category: "Kaftan", price: 2500, image: "images/dad 2.jpg", rating: 5, isNew: true },
  { id: 3, name: "west african dress", category: "BouBou", price: 7500, image: "images/martin 3.jpg", rating: 4 },
  { id: 4, name: "kids west african shirt", category: "BouBou", price: 1500, image: "images/martin 2.jpg", rating: 3 },
  { id: 5, name: "west african kitenge", category: "Blouse", price: 4500, image: "images/mama 2.jpg", rating: 4 },
  { id: 6, name: "Dress", category: "BouBou", price: 7500, image: "images/mama 1.jpg", rating: 3 },
  { id: 7, name: "Kaftan", category: "Kaftan", price: 2500, image: "images/dad 50.jpg", rating: 5 },
  { id: 8, name: "baubaus", category: "BouBou", price: 4500, image: "images/dera 1.jpg", rating: 4 },
  { id: 9, name: "Blouse", category: "Blouse", price: 7500, image: "images/Heco1.2.jpg", rating: 4 },
  { id: 10, name: "University gown", category: "University", price: 35000, image: "images/Agbada 555.jpg", rating: 5, isNew: true },
  { id: 11, name: "Agbada", category: "Agbada", price: 35000, image: "images/agbada 3.jpg", rating: 5, isNew: true },
  { id: 12, name: "improved kaunda suit", category: "Agbada", price: 11500, image: "images/rto 11500.jpg", rating: 5, isNew: true },
  { id: 13, name: "Agbada", category: "Agbada", price: 15000, image: "images/green.jpg", rating: 3 },
  { id: 14, name: "university gown", category: "University", price: 15000, image: "images/gown 1.jpg", rating: 3 },
  { id: 15, name: "Agbada", category: "Agbada", price: 35000, image: "images/agbada 7.jpg", rating: 5 },
  { id: 16, name: "University gowns", category: "University", price: 15000, image: "images/gown 2.jpg", rating: 3 },
  { id: 17, name: "Baubau", category: "BouBou", price: 4500, image: "images/dera 2.jpg", rating: 5 },
  { id: 18, name: "Agbada", category: "Agbada", price: 35000, image: "images/agbada 6.jpg", rating: 5 },
  { id: 19, name: "kaftan shirt", category: "Kaftan", price: 2500, image: "images/osore.jpg", rating: 5 },
  { id: 20, name: "Agbada", category: "Agbada", price: 12000, image: "images/agbada.jpg", rating: 5 },
  { id: 21, name: "Temple Ties", category: "Accessory", price: 1000, image: "images/ties.jpg", rating: 5 },
  { id: 22, name: "Agbada", category: "Agbada", price: 35000, image: "images/agbada 4.jpg", rating: 5 },
  { id: 23, name: "kitenge Court", category: "Blouse", price: 7000, image: "images/court luder.jpg", rating: 5 },
  { id: 24, name: "Hoodey", category: "Blouse", price: 3000, image: "images/red hoodey.jpg", rating: 5 }
];

// Initialize cart and likes from localStorage
let cart = JSON.parse(localStorage.getItem('st_cart') || '[]');
let likes = JSON.parse(localStorage.getItem('st_likes') || '[]');

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  console.log("HECO-Africa Shop loaded successfully!");
  
  // Initialize all components
  renderProducts(products);
  updateCart();
  setupSearch();
  setupFilters();
  setupCartControls();
  setupMobileMenu();
  setupFloatingSearch();
  
  // Set first filter as active
  const firstFilter = document.querySelector('.filters button');
  if (firstFilter) firstFilter.classList.add('active');
});

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('st_cart', JSON.stringify(cart));
}

// Save likes to localStorage
function saveLikes() {
  localStorage.setItem('st_likes', JSON.stringify(likes));
}

// Render product cards to the grid
function renderProducts(list) {
  const container = document.getElementById('product-list');
  if (!container) {
    console.error("Product list container not found!");
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // If no products found
  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <h3>No products found</h3>
        <p>Try a different search or category</p>
      </div>
    `;
    return;
  }
  
  // Create product cards
  list.forEach(product => {
    const isLiked = likes.includes(product.id);
    
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    
    productCard.innerHTML = `
      <div class="image-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.isNew ? '<div class="badge">NEW</div>' : ''}
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${product.id})">
          ${isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
        <div class="price">KES ${product.price.toLocaleString()}</div>
        <button class="add-btn" onclick="addToCart(${product.id})">Add to cart</button>
      </div>
    `;
    
    container.appendChild(productCard);
  });
}

// Toggle like status for a product
function toggleLike(id) {
  const index = likes.indexOf(id);
  
  if (index > -1) {
    // Remove like
    likes.splice(index, 1);
  } else {
    // Add like
    likes.push(id);
  }
  
  saveLikes();
  
  // Update the UI
  const likeBtn = document.querySelector(`.like-btn[onclick="toggleLike(${id})"]`);
  if (likeBtn) {
    likeBtn.classList.toggle('liked');
    likeBtn.innerHTML = likeBtn.classList.contains('liked') ? '❤️' : '🤍';
  }
}

// Add product to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) {
    console.error(`Product with id ${id} not found!`);
    return;
  }
  
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
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
  
  // Show success message (optional)
  console.log(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
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
  
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  countEl.textContent = totalItems;
  
  // Clear cart items
  itemsEl.innerHTML = '';
  
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    totalEl.textContent = 'KES 0';
    return;
  }
  
  // Calculate total and display items
  let totalAmount = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong><br>
        <small>KES ${item.price.toLocaleString()} × ${item.quantity}</small>
      </div>
      <div class="cart-item-actions">
        KES ${itemTotal.toLocaleString()}<br>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    
    itemsEl.appendChild(cartItem);
  });
  
  // Update total
  totalEl.textContent = `KES ${totalAmount.toLocaleString()}`;
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    
    if (query.length === 0) {
      renderProducts(products);
      return;
    }
    
    const results = products.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
    
    renderProducts(results);
  });
  
  // Clear search when overlay closes
  const closeSearchBtn = document.getElementById('closeSearch');
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      renderProducts(products);
    });
  }
}

// Setup category filters
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filters button');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const category = this.getAttribute('data-cat');
      
      if (category === 'All') {
        renderProducts(products);
      } else {
        const filteredProducts = products.filter(
          product => product.category === category
        );
        renderProducts(filteredProducts);
      }
    });
  });
}

// Setup cart controls (open/close sidebar)
function setupCartControls() {
  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  
  if (!cartBtn || !closeCartBtn || !cartSidebar) {
    console.error("Cart control elements not found!");
    return;
  }
  
  // Open cart
  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
  });
  
  // Close cart
  closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
  });
  
  // Close cart when clicking outside (on overlay)
  cartSidebar.addEventListener('click', (e) => {
    if (e.target === cartSidebar) {
      cartSidebar.classList.remove('open');
    }
  });
}

// Setup mobile menu
function setupMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const menuOverlay = document.getElementById('menuOverlay');
  
  if (!menuBtn || !closeSidebarBtn || !mobileSidebar || !menuOverlay) {
    console.error("Mobile menu elements not found!");
    return;
  }
  
  // Open menu
  menuBtn.addEventListener('click', () => {
    mobileSidebar.classList.add('open');
    menuOverlay.classList.add('active');
  });
  
  // Close menu
  closeSidebarBtn.addEventListener('click', () => {
    mobileSidebar.classList.remove('open');
    menuOverlay.classList.remove('active');
  });
  
  // Close menu when clicking on overlay
  menuOverlay.addEventListener('click', () => {
    mobileSidebar.classList.remove('open');
    menuOverlay.classList.remove('active');
  });
  
  // Close menu when clicking on links
  const menuLinks = mobileSidebar.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileSidebar.classList.remove('open');
      menuOverlay.classList.remove('active');
    });
  });
}

// Setup floating search button
function setupFloatingSearch() {
  const floatingSearchBtn = document.getElementById('floatingSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearch');
  const searchOverlay = document.getElementById('searchOverlay');
  
  if (!floatingSearchBtn || !closeSearchBtn || !searchOverlay) {
    console.error("Search elements not found!");
    return;
  }
  
  // Open search
  floatingSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    const searchInput = document.getElementById('search');
    if (searchInput) searchInput.focus();
  });
  
  // Close search
  closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
  });
  
  // Close search when clicking on overlay
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleLike = toggleLike;









