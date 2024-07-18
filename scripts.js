document.addEventListener('DOMContentLoaded', () => {
    // Afficher le contenu du panier si on est sur la page du panier
    if (document.getElementById('cartContents')) {
        displayCart();
    }
});

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = { id, name, price, quantity: 1 };
    let existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push(product);
    }

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

    let cartTable = `
        <table id="cart-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Quitar</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach((product, index) => {
        cartTable += `
            <tr>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td><input type="number" value="${product.quantity}" min="1" data-index="${index}" class="cart-quantity"></td>
                <td>$${(product.price * product.quantity).toFixed(2)}</td>
                <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
            </tr>
        `;
    });

    cartTable += `
            </tbody>
        </table>
    `;

    let total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    cartTable += `<div><p>Total: $${total.toFixed(2)}</p></div>`;
    
    cartContents.innerHTML = cartTable;

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('input', updateQuantity);
    });
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

function updateQuantity(event) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let index = event.target.dataset.index;
    cart[index].quantity = parseInt(event.target.value);
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
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

    fetch('https://nequi-8730a4c30191.herokuapp.com/api/initiate-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const qrCodeContainer = document.getElementById('qrCodeContainer');
            qrCodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${data.qrCode}&size=200x200" alt="QR Code">`;
        } else {
            alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
        }
    })
    .catch(error => console.error('Erreur:', error));
}
