document.addEventListener('DOMContentLoaded', () => {
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
        document.getElementById('cart-empty').style.display = 'block';
        document.getElementById('total-container').style.display = 'none';
        return;
    } else {
        document.getElementById('cart-empty').style.display = 'none';
    }

    cart.forEach((product, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString()}</td>
            <td><input type="number" value="${product.quantity}" min="1" data-index="${index}" class="cart-quantity"></td>
            <td>$${(product.price * product.quantity).toLocaleString()}</td>
            <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
        `;
        cartContents.appendChild(row);
    });

    let total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    let totalContainer = document.getElementById('total-container');
    totalContainer.innerHTML = `<p>Total: $${total.toLocaleString()}</p>`;
    totalContainer.style.display = 'block';

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

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value;
    const ciudad = document.getElementById('ciudad').value;

    const order = {
        nombre,
        apellido,
        direccion,
        ciudad,
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
            alert('Orden registrada con éxito. Proceda a realizar el pago.');
        } else {
            alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
        }
    })
    .catch(error => console.error('Erreur:', error));
}

function enviarComprobante() {
    alert('Envoyer le comprobante');
}
function redirectToWhatsApp(order) {
    const { nombre, apellido, direccion, ciudad, cart } = order;
    const totalContainer = document.querySelector('#total-container p').innerText;

    let message = "Hola,%0A%0AMi Carrito:%0A";
    cart.forEach(item => {
        message += `Cantidad: ${item.quantity} / Nombre: ${item.name} / Precio: $${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    message += `%0ATotal a pagar: ${totalContainer}%0A%0ADatos personales:%0ANombre: ${nombre}%0AApellido: ${apellido}%0ADireccion: ${direccion}%0ACiudad: ${ciudad}%0A%0A👉🏼Recuerda enviarnos tú comprobante de pago 🧾 para pasarlo al área de despacho✈️`;

    const whatsappUrl = `https://wa.me/3045824976?text=${message}`;
    window.location.href = whatsappUrl;
}
