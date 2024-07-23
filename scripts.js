document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cartContents')) {
        displayCart();
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm && !checkoutForm.dataset.listenerAdded) {
        checkoutForm.addEventListener('submit', handleCheckout);
        checkoutForm.dataset.listenerAdded = 'true';
    }

    updateCartCount();
});

function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
    } else {
        mobileMenu.classList.add('open');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const messages = [
        'TIEMPO DE ENTREGA HASTA 24H',
        'ENVIOS A TODO BARRANQUILLA ET SOLEDAD'
    ];
    let currentMessageIndex = 0;

    const announcementMessageElement = document.getElementById('announcementMessage');

    function showNextMessage() {
        // Ajoutez la classe fade-out pour faire disparaître l'ancien message
        announcementMessageElement.classList.add('fade-out');
        
        setTimeout(() => {
            // Changez le texte après l'animation de disparition
            announcementMessageElement.textContent = messages[currentMessageIndex];
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;

            // Ajoutez la classe fade-in pour faire apparaître le nouveau message
            announcementMessageElement.classList.remove('fade-out');
            announcementMessageElement.classList.add('fade-in');

            setTimeout(() => {
                // Retirez la classe fade-in après l'animation d'apparition
                announcementMessageElement.classList.remove('fade-in');
            }, 500);
        }, 500); // Correspond à la durée de l'animation CSS
    }

    showNextMessage(); // Affiche le premier message immédiatement
    setInterval(showNextMessage, 5000); // Change le message toutes les 5 secondes
});

document.addEventListener('DOMContentLoaded', () => {
    // Carrousel
    let currentIndex = 0;
    const carouselContainer = document.querySelector('.carousel-container');
    const images = document.querySelectorAll('.carousel-container img');
    const totalImages = images.length;

    function showNextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(showNextImage, 3000);

    // Ver Más Button
    const verMasButton = document.getElementById('verMasButton');
    const masProductos = document.getElementById('masProductos');

    verMasButton.addEventListener('click', () => {
        masProductos.classList.toggle('hidden');
        verMasButton.textContent = masProductos.classList.contains('hidden') ? 'Ver Más' : 'Ver Menos';
    });
});


function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = { id, name, price, image, quantity: 1 };
    let existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    animateCartIcon();

    // Affichez le contenu du panier pour vérifier les informations après ajout
    console.log('Cart after adding product:', cart);
}

function removeFromCart(index) {
    console.log('Appel à removeFromCart avec index:', index);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    setTimeout(() => {
        displayCart(); // Sync with page
        displayCartInPopup(); // Sync with popup
    }, 100);
}

function clearCart() {
    console.log('Appel à clearCart');
    localStorage.removeItem('cart');
    updateCartCount();
    setTimeout(() => {
        displayCart(); // Sync with page
        displayCartInPopup(); // Sync with popup
    }, 100);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCountElement = document.getElementById('cart-count');
    let popupCartCountElement = document.getElementById('popup-cart-count');
    
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    } else {
        console.error('Element with ID "cart-count" not found.');
    }
    
    if (popupCartCountElement) {
        popupCartCountElement.innerText = cart.length;
    } else {
        console.error('Element with ID "popup-cart-count" not found.');
    }
}

function animateCartIcon() {
    const cartIconHeader = document.querySelector('.header-content a[href="carrito.html"] img');
    const cartIcon = document.querySelector('.cart-popup-button button img');
    const cartIconPopup = document.querySelector('.cart-popup-button img');
    const cartPopup = document.getElementById('cart-popup');

    // Ajout de l'animation de rebondissement à l'icône du panier dans le header
    cartIconHeader.classList.add('animate-cart');
    setTimeout(() => {
        cartIconHeader.classList.remove('animate-cart');
    }, 500);

    // Ajout de l'animation de rebondissement à l'icône du panier dans le pop-up
    cartIconPopup.classList.add('bounce');
    setTimeout(() => {
        cartIconPopup.classList.remove('bounce');
    }, 1000); // Durée de l'animation définie dans CSS
    
    // Trigger popup animation
    cartPopup.classList.add('popup-animation');
    setTimeout(() => {
        cartPopup.classList.remove('popup-animation');
    }, 500);
}


function openCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    const overlay = document.createElement('div');
    overlay.id = 'cart-popup-overlay';
    overlay.classList.add('cart-popup-overlay');
    document.body.appendChild(overlay);

    overlay.addEventListener('click', closeCartPopup);
    cartPopup.style.display = 'block';
    overlay.style.display = 'block';
    displayCartInPopup(); // Update the popup with cart items
}

function closeCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    const overlay = document.getElementById('cart-popup-overlay');

    cartPopup.style.display = 'none';
    if (overlay) {
        overlay.removeEventListener('click', closeCartPopup);
        document.body.removeChild(overlay);
    }
}

function displayCartInPopup() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContents = document.getElementById('cart-popup-items');
    cartContents.innerHTML = '';

    if (cart.length === 0) {
        cartContents.innerHTML = '<tr><td colspan="6">Tu carrito está vacío.</td></tr>';
        document.getElementById('popup-total-amount').innerText = '0';
        return;
    }

    cart.forEach((product, index) => {
        let row = document.createElement('tr');
        let imagePath = product.image;

        row.innerHTML = `
            <td><img src="${imagePath}" alt="${product.name}" width="50"></td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString()}</td>
            <td>${product.quantity}</td>
            <td>$${(product.price * product.quantity).toLocaleString()}</td>
        `;
        cartContents.appendChild(row);
    });

    let total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    document.getElementById('popup-total-amount').innerText = total.toLocaleString();
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContents = document.getElementById('cartContents');
    cartContents.innerHTML = '';

    if (cart.length === 0) {
        cartContents.innerHTML = '<tr><td colspan="6">Tu carrito está vacío.</td></tr>';
        document.getElementById('total-container').style.display = 'none';
        return;
    } else {
        document.getElementById('total-container').style.display = 'block';
    }

    cart.forEach((product, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" width="50" class="cart-image"></td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString()}</td>
            <td><input type="number" value="${product.quantity}" min="1" data-index="${index}" class="cart-quantity"></td>
            <td>$${(product.price * product.quantity).toLocaleString()}</td>
            <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
        `;
        cartContents.appendChild(row);
    });

    let total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    document.getElementById('total-amount').innerText = total.toLocaleString();

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('input', updateQuantity);
    });
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
    updateCartCount();
    displayCart();
    displayCartInPopup(); // Sync with popup
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('envia-option').classList.add('selected'); // Set default selected option
    toggleDeliveryFields('envia'); // Set default fields

    document.getElementById('envia').addEventListener('change', () => selectDeliveryOption('envia'));
    document.getElementById('tienda').addEventListener('change', () => selectDeliveryOption('tienda'));
});

function selectDeliveryOption(option) {
    const enviaOption = document.getElementById('envia-option');
    const tiendaOption = document.getElementById('tienda-option');

    if (option === 'envia') {
        enviaOption.classList.add('selected');
        tiendaOption.classList.remove('selected');
        document.getElementById('envia').checked = true;
    } else if (option === 'tienda') {
        tiendaOption.classList.add('selected');
        enviaOption.classList.remove('selected');
        document.getElementById('tienda').checked = true;
    }

    toggleDeliveryFields(option);
}

function toggleDeliveryFields(selectedOption) {
    const enviaFields = document.getElementById('envia-fields');
    const tiendaFields = document.getElementById('tienda-fields');

    if (selectedOption === 'envia') {
        enviaFields.classList.remove('hidden');
        tiendaFields.classList.add('hidden');
    } else if (selectedOption === 'tienda') {
        tiendaFields.classList.remove('hidden');
        enviaFields.classList.add('hidden');
    }
}
function handleCheckout(event) {
    event.preventDefault();

    const whatsapp = document.getElementById('whatsapp').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Vérifiez que chaque objet du panier contient bien les propriétés name, quantity, et price
    for (let item of cart) {
        if (!item.name || typeof item.name !== 'string') {
            console.error('Item missing name or name is not a string:', item);
            alert('Un des articles dans le panier est invalide.');
            return;
        }
        if (!item.quantity || typeof item.quantity !== 'number') {
            console.error('Item missing quantity or quantity is not a number:', item);
            alert('Un des articles dans le panier est invalide.');
            return;
        }
        if (!item.price || typeof item.price !== 'number') {
            console.error('Item missing price or price is not a number:', item);
            alert('Un des articles dans le panier est invalide.');
            return;
        }
    }

    if (!whatsapp || !nombre || !apellido) {
        alert('Por favor complete todos los campos de contacto antes de continuar.');
        return;
    }

    if (deliveryOption === 'envia' && (!direccion || !ciudad)) {
        alert('Por favor complete los campos de dirección y ciudad.');
        return;
    }

    const order = {
        whatsapp,
        nombre,
        apellido,
        deliveryOption,
        direccion: deliveryOption === 'envia' ? direccion : 'Retiro en tienda',
        ciudad: deliveryOption === 'envia' ? ciudad : '',
        cart: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }))
    };

    // Affichez l'objet order pour vérifier les informations avant de les envoyer
    console.log('Order object to be sent:', order);

    fetch('https://nequi-8730a4c30191.herokuapp.com/api/save-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showPaymentDetails();
        } else {
            alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
        }
    })
    .catch(error => console.error('Erreur:', error));
}

function showPaymentDetails() {
    const paymentDetails = document.querySelector('.payment-details');
    paymentDetails.style.display = 'block';
    paymentDetails.scrollIntoView({ behavior: 'smooth' });
}

function redirectToWhatsApp() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let message = "Hola,%0A%0AMi Carrito:%0A";
    cart.forEach(item => {
        message += `Cantidad: ${item.quantity} / Nombre: ${item.name} / Precio: $${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    message += `%0ADatos personales:%0ANombre: ${nombre}%0AApellido: ${apellido}%0ADireccion: ${direccion}%0ACiudad: ${ciudad}%0A%0A👉🏼Recuerda enviarnos tú comprobante de pago 🧾 para pasarlo al área de despacho✈️`;

    const whatsappUrl = `https://wa.me/3045824976?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function syncCartBetweenTabs() {
    displayCart();
    displayCartInPopup();
}
