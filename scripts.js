document.addEventListener('DOMContentLoaded', () => {
    // Afficher le contenu du panier si on est sur la page du panier
    if (document.getElementById('cartContents')) {
        displayCart();
    }
});

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = { id, name, price };
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto agregado al carrito!');
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContents = document.getElementById('cartContents');
    cartContents.innerHTML = '';

    if (cart.length === 0) {
        cartContents.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    cart.forEach((product, index) => {
        let productElement = document.createElement('div');
        productElement.innerHTML = `
            <p>${product.name} - $${product.price}</p>
            <button onclick="removeFromCart(${index})">Eliminar</button>
        `;
        cartContents.appendChild(productElement);
    });

    let total = cart.reduce((sum, product) => sum + product.price, 0);
    let totalElement = document.createElement('div');
    totalElement.innerHTML = `<p>Total: $${total}</p>`;
    cartContents.appendChild(totalElement);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}

function finalizePurchase() {
    window.location.href = 'finalizar.html';
}

function handleCheckout(event) {
    event.preventDefault();
    const whatsapp = document.getElementById('whatsapp').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;

    const order = {
        whatsapp,
        nombre,
        apellido,
        cart: JSON.parse(localStorage.getItem('cart')) || []
    };

    fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('orderId', data.orderId);
            localStorage.setItem('qrCode', data.qrCode);
            window.location.href = 'pagar.html';
        } else {
            alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
        }
    })
    .catch(error => console.error('Erreur:', error));
}

