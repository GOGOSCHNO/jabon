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
