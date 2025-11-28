// Produtos
const products = [
    { id: 2, name: 'Mouse Attack Shark R1', price: 135, image: 'https://down-br.img.susercontent.com/file/sg-11134201-7rcce-ltorcbvni9bh82', category: 'Periféricos' },
    { id: 3, name: 'RX 570 4gb MSI ARMOR', price: 490, image: 'https://images.kabum.com.br/produtos/fotos/88810/88810_index_gg.jpg', category: 'Hardware' },
];

let cart = [];
const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const categoryFilters = document.getElementById('category-filters');
const cartBtnFixed = document.getElementById('cart-btn-fixed');

// Criar botões de categoria
const categories = [...new Set(products.map(p => p.category))];
categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary category-btn';
    btn.textContent = cat;
    btn.dataset.category = cat;
    categoryFilters.appendChild(btn);
});
const allBtn = document.createElement('button');
allBtn.className = 'btn btn-outline-primary category-btn active';
allBtn.textContent = 'Todos';
allBtn.dataset.category = 'all';
categoryFilters.prepend(allBtn);

// Mostrar produtos
function displayProducts(category = 'all') {
    productsContainer.innerHTML = '';
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    filtered.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4';
        col.innerHTML = `
            <div class="card product-card mb-4 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <div class="card-category category-${product.category} mb-1">${product.category}</div>
                    <h6 class="card-title">${product.name}</h6>
                    <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">Adicionar</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(col);
    });
}

// Filtro de categoria
categoryFilters.addEventListener('click', e => {
    if(e.target.classList.contains('category-btn')){
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        displayProducts(e.target.dataset.category);
    }
});

// Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(p => p.id === productId);
    if(existing) existing.quantity += 1;
    else cart.push({...product, quantity: 1});
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Abrir modal do carrinho
cartBtnFixed.addEventListener('click', () => {
    displayCartItems();
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});

function displayCartItems() {
    if(cart.length === 0){
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotal.textContent = 'Total: R$ 0.00';
        return;
    }
    let html = '<ul class="list-group">';
    cart.forEach(item => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.name}</strong><br>R$ ${item.price.toFixed(2)}
                </div>
                <div class="d-flex align-items-center">
                    <input type="number" min="1" class="form-control cart-quantity me-2" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">X</button>
                </div>
            </li>`;
    });
    html += '</ul>';
    cartItems.innerHTML = html;
    updateCartTotal();
}

function updateQuantity(productId, quantity){
    const item = cart.find(p => p.id === productId);
    if(item){
        item.quantity = parseInt(quantity);
        updateCartCount();
        updateCartTotal();
    }
}

function removeFromCart(productId){
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCartItems();
}

function updateCartTotal(){
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Checkout WhatsApp
document.getElementById('checkout-btn').addEventListener('click', () => {
    if(cart.length === 0) return alert('Carrinho vazio!');
    let message = 'Olá, quero comprar:\n';
    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `Total: R$ ${total.toFixed(2)}`;
    const phone = '5517991205893'; // substitua pelo seu WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
});

// Inicial
displayProducts();
