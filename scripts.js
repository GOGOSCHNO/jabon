// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

function initializePage() {
    // Initialiser le panier
    initializeCart();

    // Initialiser le formulaire de validation
    initializeCheckoutForm();

    // Initialiser les annonces déroulantes
    initializeAnnouncementMessage();

    // Initialiser le carrousel et les boutons associés
    initializeCarousel();

    // Initialiser les options de livraison
    initializeDeliveryOptions();

    // Initialiser les interactions avec les produits
    initializeProductInteractions();
}

// Fonction d'initialisation du panier
function initializeCart() {
    if (document.getElementById('cartContents')) {
        displayCart();
    }
    updateCartCount();
}

// Fonction d'initialisation du formulaire de validation
function initializeCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Fonction d'initialisation des messages d'annonce
function initializeAnnouncementMessage() {
    const messages = [
        'TIEMPO DE ENTREGA HASTA 24H',
        'ENVIOS A TODO BARRANQUILLA ET SOLEDAD'
    ];
    let currentMessageIndex = 0;
    const announcementMessageElement = document.getElementById('announcementMessage');

    function showNextMessage() {
        announcementMessageElement.classList.add('fade-out');
        setTimeout(() => {
            announcementMessageElement.textContent = messages[currentMessageIndex];
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
            announcementMessageElement.classList.remove('fade-out');
            announcementMessageElement.classList.add('fade-in');
            setTimeout(() => {
                announcementMessageElement.classList.remove('fade-in');
            }, 500);
        }, 500);
    }

    showNextMessage();
    setInterval(showNextMessage, 5000);
}

// Fonction d'initialisation du carrousel et du bouton "Ver Más"
function initializeCarousel() {
    let currentIndex = 0;
    const carouselContainer = document.querySelector('.carousel-container');
    const mediaItems = document.querySelectorAll('.carousel-container img, .carousel-container video');
    const totalItems = mediaItems.length;

    function showNextItem() {
        currentIndex = (currentIndex + 1) % totalItems;
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(showNextItem, 3200);

    const verMasButton = document.getElementById('verMasButton');
    const masProductos = document.getElementById('masProductos');
    const verMenosButton = document.getElementById('verMenosButton');

    verMasButton.addEventListener('click', () => {
        masProductos.classList.toggle('hidden');
        verMasButton.style.display = masProductos.classList.contains('hidden') ? 'block' : 'none';
        verMenosButton.style.display = masProductos.classList.contains('hidden') ? 'none' : 'block';
    });

    verMenosButton.addEventListener('click', () => {
        masProductos.classList.add('hidden');
        verMasButton.style.display = 'block';
        verMenosButton.style.display = 'none';
    });
}

// Fonction d'initialisation des options de livraison
function initializeDeliveryOptions() {
    const enviaOption = document.getElementById('envia-option');
    const tiendaOption = document.getElementById('tienda-option');

    if (enviaOption && tiendaOption) {
        enviaOption.classList.add('selected');
        toggleDeliveryFields('envia');
        document.getElementById('envia').addEventListener('change', () => selectDeliveryOption('envia'));
        document.getElementById('tienda').addEventListener('change', () => selectDeliveryOption('tienda'));
    }
}

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

// Fonction de gestion du processus de validation de l'achat
function handleCheckout(event) {
    event.preventDefault();

    const whatsapp = document.getElementById('whatsapp').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    for (let item of cart) {
        if (!item.name || typeof item.name !== 'string' || !item.quantity || typeof item.quantity !== 'number' || !item.price || typeof item.price !== 'number') {
            console.error('Un des articles dans le panier est invalide:', item);
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
                displayQRCode(data.qrCodeUrl);
            } else {
                alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
            }
        })
        .catch(error => console.error('Erreur:', error));
}

// Fonction pour afficher le QR code
function displayQRCode(qrCodeUrl) {
    const qrCodeImage = document.createElement('img');
    qrCodeImage.src = qrCodeUrl;
    document.getElementById('qr-code-container').appendChild(qrCodeImage);
    document.getElementById('payment-status').innerText = 'Escanea el código QR para realizar el pago.';
}

// Fonctions de gestion du panier
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

    console.log('Cart after adding product:', cart);
}

function removeFromCart(index) {
    console.log('Appel à removeFromCart avec index:', index);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    setTimeout(() => {
        displayCart();
        displayCartInPopup();
    }, 100);
}

function clearCart() {
    console.log('Appel à clearCart');
    localStorage.removeItem('cart');
    updateCartCount();
    setTimeout(() => {
        displayCart();
        displayCartInPopup();
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

function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContents = document.getElementById('cartContents');
    if (!cartContents) {
        console.error("Element with ID 'cartContents' not found.");
        return;
    }
    cartContents.innerHTML = '';

    if (cart.length === 0) {
        cartContents.innerHTML = '<tr><td colspan="6">Tu carrito está vacío.</td></tr>';
        let totalContainer = document.getElementById('total-container');
        if (totalContainer) {
            totalContainer.style.display = 'none';
        } else {
            console.error("Element with ID 'total-container' not found.");
        }
        return;
    } else {
        let totalContainer = document.getElementById('total-container');
        if (totalContainer) {
            totalContainer.style.display = 'block';
        } else {
            console.error("Element with ID 'total-container' not found.");
        }
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
    let totalAmountElement = document.getElementById('total-amount');
    if (totalAmountElement) {
        totalAmountElement.innerText = total.toLocaleString();
    } else {
        console.error("Element with ID 'total-amount' not found.");
    }

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('input', updateQuantity);
    });
}

function displayCartInPopup() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContents = document.getElementById('cart-popup-items');
    if (!cartContents) {
        console.error("Element with ID 'cart-popup-items' not found.");
        return;
    }
    cartContents.innerHTML = '';

    if (cart.length === 0) {
        cartContents.innerHTML = '<tr><td colspan="6">Tu carrito está vacío.</td></tr>';
        let totalAmountElement = document.getElementById('popup-total-amount');
        if (totalAmountElement) {
            totalAmountElement.innerText = '0';
        } else {
            console.error("Element with ID 'popup-total-amount' not found.");
        }
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
            <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
        `;
        cartContents.appendChild(row);
    });

    let total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    let totalAmountElement = document.getElementById('popup-total-amount');
    if (totalAmountElement) {
        totalAmountElement.innerText = total.toLocaleString();
    } else {
        console.error("Element with ID 'popup-total-amount' not found.");
    }
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
    displayCartInPopup();
}

// Fonction pour montrer les détails de paiement
function showPaymentDetails() {
    const paymentDetails = document.querySelector('.payment-details');
    paymentDetails.style.display = 'block';
    paymentDetails.scrollIntoView({ behavior: 'smooth' });
}

// Fonction pour rediriger vers WhatsApp
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

// Fonction pour synchroniser le panier entre les onglets
function syncCartBetweenTabs() {
    displayCart();
    displayCartInPopup();
}

// Fonction pour gérer l'affichage du bouton du panier par rapport au pied de page
window.addEventListener('scroll', function() {
    const carritoButton = document.querySelector('.cart-popup-button');
    const footer = document.querySelector('footer');
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop <= windowHeight) {
        carritoButton.classList.add('above-footer');
    } else {
        carritoButton.classList.remove('above-footer');
    }
});

// Gestion du sous-menu
document.addEventListener("DOMContentLoaded", function () {
    const navItem = document.getElementById("capilar-item");
    const submenu = document.getElementById("submenu-capilar");
    let timeoutId;

    navItem.addEventListener("mouseover", function () {
        clearTimeout(timeoutId);
        submenu.classList.add("show");
    });

    navItem.addEventListener("mouseout", function () {
        timeoutId = setTimeout(function () {
            submenu.classList.remove("show");
        }, 300);
    });

    submenu.addEventListener("mouseover", function () {
        clearTimeout(timeoutId);
        submenu.classList.add("show");
    });

    submenu.addEventListener("mouseout", function () {
        timeoutId = setTimeout(function () {
            submenu.classList.remove("show");
        }, 300);
    });
});

// Interactions avec les produits
function initializeProductInteractions() {
    document.querySelectorAll('.product-top').forEach(item => {
        item.addEventListener('click', function() {
            const productName = item.querySelector('h3').innerText;
            gtag('event', 'product_click', {
                'event_category': 'Product',
                'event_label': productName,
                'value': item.closest('.product').dataset.id
            });
        });
    });

    document.querySelector('.carrito-icon').addEventListener('click', function() {
        gtag('event', 'carrito_popup_open', {
            'event_category': 'Carrito',
            'event_label': 'Popup Opened'
        });
    });

    document.querySelector('.cart-popup-footer button').addEventListener('click', function() {
        gtag('event', 'finalize_purchase', {
            'event_category': 'Checkout',
            'event_label': 'Finalizar Button Clicked'
        });
    });
}
