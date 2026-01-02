// Admin Password
const ADMIN_PASSWORD = "1972";

// Category Emojis
const categoryEmojis = {
    medicines: "💊",
    patanjali: "🌿",
    ayurvedic: "🍃",
    allopathic: "⚕️",
    general: "🏪",
    babycare: "👶"
};

// Initialize products from memory
let productsData = {};

// Load products from memory
function loadProducts() {
    const saved = localStorage.getItem('mathurMedicoseProducts');
    if (saved) {
        try {
            productsData = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading products:', e);
            productsData = getDefaultProducts();
        }
    } else {
        productsData = getDefaultProducts();
    }
}

// Get default products
function getDefaultProducts() {
    return {
        medicines: [
            { id: Date.now() + 1, name: "Dolo 650mg", image: "💊", mrp: 50, discount: 10, price: 45 },
            { id: Date.now() + 2, name: "Crocin Advance", image: "💊", mrp: 40, discount: 15, price: 34 }
        ],
        patanjali: [
            { id: Date.now() + 3, name: "Patanjali Aloe Vera Gel", image: "🌿", mrp: 150, discount: 20, price: 120 },
            { id: Date.now() + 4, name: "Patanjali Honey", image: "🌿", mrp: 200, discount: 10, price: 180 }
        ],
        ayurvedic: [
            { id: Date.now() + 5, name: "Dabur Chyawanprash", image: "🍃", mrp: 400, discount: 12, price: 352 },
            { id: Date.now() + 6, name: "Himalaya Liv.52", image: "🍃", mrp: 180, discount: 10, price: 162 }
        ],
        allopathic: [
            { id: Date.now() + 7, name: "Augmentin 625", image: "⚕️", mrp: 200, discount: 5, price: 190 },
            { id: Date.now() + 8, name: "Azithromycin 500", image: "⚕️", mrp: 150, discount: 10, price: 135 }
        ],
        general: [
            { id: Date.now() + 9, name: "Dettol Soap", image: "🧼", mrp: 50, discount: 15, price: 42.5 },
            { id: Date.now() + 10, name: "Band-Aid Pack", image: "🩹", mrp: 80, discount: 10, price: 72 }
        ],
        babycare: [
            { id: Date.now() + 11, name: "Johnson's Baby Powder", image: "👶", mrp: 180, discount: 15, price: 153 },
            { id: Date.now() + 12, name: "Pampers Diapers", image: "👶", mrp: 800, discount: 12, price: 704 }
        ]
    };
}

// Save products to memory
function saveProducts() {
    try {
        localStorage.setItem('mathurMedicoseProducts', JSON.stringify(productsData));
    } catch (e) {
        console.error('Error saving products:', e);
        alert('Error saving products. Storage might be full.');
    }
}

let currentCategory = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    showAllCategories();
    setupAdminAccess();
    setupAutoCalculatePrice();
});

// Setup admin access (triple click on logo)
function setupAdminAccess() {
    let clickCount = 0;
    let clickTimer;
    
    const logoSection = document.querySelector('.logo-section');
    logoSection.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 800);
        }
        
        if (clickCount === 3) {
            clearTimeout(clickTimer);
            clickCount = 0;
            document.getElementById('admin-access-btn').style.display = 'block';
            setTimeout(() => {
                document.getElementById('admin-access-btn').style.display = 'none';
            }, 5000);
        }
    });
}

// Admin Login Functions
function openAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'block';
    document.getElementById('admin-password').value = '';
    document.getElementById('login-error').style.display = 'none';
}

function closeAdminLogin() {
    document.getElementById('admin-login-modal').style.display = 'none';
}

function verifyAdminPassword() {
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        closeAdminLogin();
        openAdminPanel();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// Admin Panel Functions
function openAdminPanel() {
    document.getElementById('admin-panel-modal').style.display = 'block';
    showAdminTab('add');
    loadAdminProducts();
}

function closeAdminPanel() {
    document.getElementById('admin-panel-modal').style.display = 'none';
}

function showAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');
    
    if (tab === 'add') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('add-product-tab').style.display = 'block';
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('manage-products-tab').style.display = 'block';
        loadAdminProducts();
    }
}

// Auto-calculate price based on MRP and discount
function setupAutoCalculatePrice() {
    const mrpInput = document.getElementById('product-mrp');
    const discountInput = document.getElementById('product-discount');
    const priceInput = document.getElementById('product-price');
    
    function calculatePrice() {
        const mrp = parseFloat(mrpInput.value) || 0;
        const discount = parseFloat(discountInput.value) || 0;
        const price = mrp - (mrp * discount / 100);
        priceInput.value = price.toFixed(2);
    }
    
    mrpInput.addEventListener('input', calculatePrice);
    discountInput.addEventListener('input', calculatePrice);
}

// Add Product
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const category = document.getElementById('product-category').value;
    const name = document.getElementById('product-name').value;
    const imageFile = document.getElementById('product-image').files[0];
    const mrp = parseFloat(document.getElementById('product-mrp').value);
    const discount = parseFloat(document.getElementById('product-discount').value);
    const price = parseFloat(document.getElementById('product-price').value);
    
    if (!productsData[category]) {
        productsData[category] = [];
    }
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const product = {
                id: Date.now(),
                name: name,
                image: event.target.result,
                mrp: mrp,
                discount: discount,
                price: price,
                isCustomImage: true
            };
            
            productsData[category].push(product);
            saveProducts();
            alert('Product added successfully!');
            document.getElementById('add-product-form').reset();
            loadAdminProducts();
        };
        reader.readAsDataURL(imageFile);
    } else {
        const product = {
            id: Date.now(),
            name: name,
            image: categoryEmojis[category],
            mrp: mrp,
            discount: discount,
            price: price,
            isCustomImage: false
        };
        
        productsData[category].push(product);
        saveProducts();
        alert('Product added successfully!');
        document.getElementById('add-product-form').reset();
        loadAdminProducts();
    }
});

// Load Admin Products
function loadAdminProducts() {
    const filterCategory = document.getElementById('filter-category').value;
    const productsList = document.getElementById('admin-products-list');
    
    productsList.innerHTML = '';
    
    const categoriesToShow = filterCategory === 'all' 
        ? Object.keys(productsData) 
        : [filterCategory];
    
    let hasProducts = false;
    
    categoriesToShow.forEach(category => {
        if (productsData[category] && productsData[category].length > 0) {
            hasProducts = true;
            productsData[category].forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'admin-product-item';
                productItem.innerHTML = `
                    <div class="admin-product-info">
                        <h4>${product.name}</h4>
                        <p>Category: ${getCategoryName(category)}</p>
                        <p>MRP: ₹${product.mrp} | Discount: ${product.discount}% | Price: ₹${product.price}</p>
                    </div>
                    <div class="admin-product-actions">
                        <button class="delete-btn" onclick="deleteProduct('${category}', ${product.id})">Delete</button>
                    </div>
                `;
                productsList.appendChild(productItem);
            });
        }
    });
    
    if (!hasProducts) {
        productsList.innerHTML = '<div class="empty-state"><h3>No products found</h3><p>Add products to get started!</p></div>';
    }
}

function getCategoryName(category) {
    const names = {
        medicines: 'Medicines',
        patanjali: 'Patanjali Products',
        ayurvedic: 'Ayurvedic',
        allopathic: 'Allopathic',
        general: 'General Items',
        babycare: 'Baby Care'
    };
    return names[category] || category;
}

function filterAdminProducts() {
    loadAdminProducts();
}

// Delete Product
function deleteProduct(category, productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        productsData[category] = productsData[category].filter(p => p.id !== productId);
        saveProducts();
        loadAdminProducts();
        
        if (currentCategory === category || currentCategory === 'all') {
            if (currentCategory === 'all') {
                showAllCategories();
            } else {
                displayProducts(category);
            }
        }
    }
}

// Show all categories
function showAllCategories() {
    currentCategory = 'all';
    document.getElementById('category-title').textContent = 'All Products';
    document.getElementById('back-btn').style.display = 'none';
    document.querySelector('.categories').style.display = 'block';
    document.getElementById('products-grid').innerHTML = '';
}

// Show specific category products
function showCategory(category) {
    currentCategory = category;
    
    const categoryNames = {
        medicines: 'Medicines',
        patanjali: 'Patanjali Products',
        ayurvedic: 'Ayurvedic',
        allopathic: 'Allopathic',
        general: 'General Items',
        babycare: 'Baby Care'
    };
    
    document.getElementById('category-title').textContent = categoryNames[category];
    document.getElementById('back-btn').style.display = 'block';
    
    document.querySelector('.categories').style.display = 'none';
    
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    
    displayProducts(category);
}

// Display products in the grid
function displayProducts(category) {
    const productsGrid = document.getElementById('products-grid');
    const products = productsData[category] || [];
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products available</h3>
                <p>Products will be added soon!</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => {
        const imageHTML = product.isCustomImage 
            ? `<img src="${product.image}" alt="${product.name}" />`
            : product.image;
            
        return `
            <div class="product-card">
                <div class="product-image">${imageHTML}</div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-pricing">
                        <span class="product-mrp">MRP: ₹${product.mrp}</span>
                        <span class="product-discount">${product.discount}% OFF</span>
                        <span class="product-price">₹${product.price}</span>
                    </div>
                    <button class="order-product-btn" onclick="orderProduct('${product.name}', ${product.price})">
                        Order on WhatsApp
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Order product via WhatsApp
function orderProduct(productName, price) {
    const message = encodeURIComponent(
        `Hello! I want to order:\n\nProduct: ${productName}\nPrice: ₹${price}\n\nPlease confirm availability.`
    );
    const whatsappUrl = `https://wa.me/919457281282?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('admin-login-modal');
    const panelModal = document.getElementById('admin-panel-modal');
    
    if (event.target === loginModal) {
        closeAdminLogin();
    }
    if (event.target === panelModal) {
        closeAdminPanel();
    }
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation for category cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe category cards on load
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.category-card, .product-card, .feature-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});