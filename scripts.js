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
        var chatPopup = document.getElementById('chat-popup');
    var chatIcon = document.getElementById('chat-icon');
    var chatIframe = document.getElementById('chat-iframe');

    // Fonction pour afficher ou masquer le pop-up du chatbot
    document.getElementById('chat-icon').addEventListener('click', function() {
        if (chatPopup.classList.contains('show')) {
            chatPopup.classList.remove('show');
            setTimeout(function() {
                chatPopup.style.display = 'none';
            }, 300); // Délai pour laisser le temps à l'animation de se terminer
            chatIcon.style.display = 'block';
        } else {
            chatPopup.style.display = 'block';
            setTimeout(function() {
                chatPopup.classList.add('show');
            }, 10); // Délai pour laisser le temps à l'élément de passer en display:block
            chatIcon.style.display = 'none';
        }
    });

    // Événement pour fermer le pop-up du chatbot lorsque l'utilisateur clique en dehors
    window.addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdown-menu');
        if (event.target !== chatPopup && !chatPopup.contains(event.target) && event.target !== chatIcon && !chatIcon.contains(event.target) && event.target !== dropdownMenu && !dropdownMenu.contains(event.target)) {
            chatPopup.classList.remove('show');
            setTimeout(function() {
                chatPopup.style.display = 'none';
            }, 300); // Délai pour laisser le temps à l'animation de se terminer
            chatIcon.style.display = 'block';
            dropdownMenu.style.display = 'none';
        }
    });

    // Fonction pour agrandir ou réduire le pop-up du chatbot
    document.getElementById('expand-button').addEventListener('click', function() {
        if (chatPopup.style.width === '650px') {
            chatPopup.style.width = '400px';
            chatPopup.style.height = '600px';
        } else {
            chatPopup.style.width = '650px';
            chatPopup.style.height = '87%';
        }
    });

    // Fonction pour afficher ou masquer le menu déroulant
    document.getElementById('menu-button').addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
            dropdownMenu.style.display = 'block';
        } else {
            dropdownMenu.style.display = 'none';
        }
        event.stopPropagation();
    });

    // Fonction pour minimiser le pop-up du chatbot
    document.getElementById('minimize-button').addEventListener('click', function() {
        chatPopup.classList.remove('show');
        setTimeout(function() {
            chatPopup.style.display = 'none';
        }, 300); // Délai pour laisser le temps à l'animation de se terminer
        chatIcon.style.display = 'block';
    });

    // Ajuster la hauteur du chatbot sur mobile
    function adjustChatbotHeight() {
        if (isMobileDevice()) {
            const viewportHeight = window.innerHeight;
            chatPopup.style.height = `${viewportHeight}px`;
        }
    }

    // Appeler cette fonction lors du redimensionnement de la fenêtre
    window.addEventListener('resize', adjustChatbotHeight);

    // Appeler cette fonction une fois lors du chargement de la page pour s'assurer que le chatbot est dimensionné correctement
    window.addEventListener('load', adjustChatbotHeight);
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
function toggleMenu() {
    var mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("active");
}

function toggleSubmenuMobile(submenuId) {
    var submenuElement = document.getElementById(submenuId);
    submenuElement.classList.toggle("active");
}


// Fonction pour gérer le paiement et l'enregistrement des informations utilisateur
function handleCheckout(event) {
    event.preventDefault();

    const whatsapp = document.getElementById('whatsapp').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Validation du panier
    for (let item of cart) {
        if (!item.name || typeof item.name !== 'string' || !item.quantity || typeof item.quantity !== 'number' || !item.price || typeof item.price !== 'number') {
            console.error('Un des articles dans le panier est invalide:', item);
            alert('Un des articles dans le panier est invalide.');
            return;
        }
    }

    // Validation des champs utilisateur
    if (!whatsapp || !nombre || !apellido) {
        alert('Por favor complete todos los campos de contacto antes de continuar.');
        return;
    }

    if (deliveryOption === 'envia' && (!direccion || !ciudad)) {
        alert('Por favor complete los campos de dirección y ciudad.');
        return;
    }

    // Affiche le spinner de chargement
    document.getElementById('loading-spinner').style.display = 'flex';

    // Créer l'objet commande
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

    // Envoie de la commande à l'API
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
            // Vérifie que le code QR est valide
            if (data.qrCodeUrl && data.qrCodeUrl.generateCodeQRRS && data.qrCodeUrl.generateCodeQRRS.codeQR) {
                let qrCode = data.qrCodeUrl.generateCodeQRRS.codeQR;
                
                // Cache le spinner
                document.getElementById('loading-spinner').style.display = 'none';

                // Afficher le QR code avec les instructions
                displayQRCode(qrCode);
            } else {
                console.error('QR Code data is missing or invalid:', data.qrCodeUrl);
                document.getElementById('loading-spinner').style.display = 'none'; // Cache le spinner
            }
        } else {
            alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
            document.getElementById('loading-spinner').style.display = 'none'; // Cache le spinner
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('loading-spinner').style.display = 'none'; // Cache le spinner en cas d'erreur
    });
}
// Fonction pour afficher le QR code et les instructions de paiement
function displayQRCode(qrCode) {
    const qrCodeContainer = document.getElementById('qr-code-container');
    const qrOverlay = document.getElementById('qr-overlay'); // Utilisation de l'overlay au lieu de qr-instructions

    if (qrCodeContainer && qrOverlay) {
        // Nettoie le contenu existant du conteneur QR code
        qrCodeContainer.innerHTML = '';

        // Utilise la bibliothèque qrcode.js pour générer le QR code
        new QRCode(qrCodeContainer, {
            text: "bancadigital-" + qrCode, // Concatène bancadigital au code fourni par Nequi
            width: 200,  // Largeur du QR code
            height: 200  // Hauteur du QR code
        });

        // Affiche l'overlay et la section des instructions
        qrOverlay.style.display = 'flex';  // Utilise 'flex' pour que l'overlay soit centré

        // Affiche le message de statut du paiement
        document.getElementById('payment-status').innerText = 'Escanea el código QR para realizar el pago.';
    } else {
        console.error('QR Code container or overlay not found.');
    }
}

// Fonction pour masquer le QR code lorsqu'on clique en dehors de la section
function hideQRCodeSection() {
    document.getElementById('qr-overlay').style.display = 'none';
}
// Permettre de fermer l'overlay en cliquant en dehors de la section
document.getElementById('qr-overlay').addEventListener('click', function(event) {
    if (event.target === this) {
        hideQRCodeSection();
    }
});
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
function finalizePurchase() {
    window.location.href = 'finalizar.html';
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
            console.log('Product clicked:', productName); // Log de débogage
            if (typeof gtag !== 'undefined') {
                gtag('event', 'product_click', {
                    'event_category': 'Product',
                    'event_label': productName,
                    'value': item.closest('.product').dataset.id
                });
            } else {
                console.error('Google Analytics not initialized'); // Alerte si gtag n'est pas défini
            }
        });
    });

    const carritoIcon = document.querySelector('.carrito-icon');
    if (carritoIcon) {
        carritoIcon.addEventListener('click', function() {
            console.log('Carrito popup opened');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'carrito_popup_open', {
                    'event_category': 'Carrito',
                    'event_label': 'Popup Opened'
                });
            }
        });
    }

    const finalizeButton = document.querySelector('.cart-popup-footer button');
    if (finalizeButton) {
        finalizeButton.addEventListener('click', function() {
            console.log('Finalize purchase clicked');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'finalize_purchase', {
                    'event_category': 'Checkout',
                    'event_label': 'Finalizar Button Clicked'
                });
            }
        });
    }
}
document.querySelectorAll('.video-item video').forEach(video => {
    video.addEventListener('play', function() {
        // Réinitialiser toutes les vidéos
        document.querySelectorAll('.video-item').forEach(item => {
            item.classList.remove('active');
            item.classList.add('inactive');
        });

        // Activer la vidéo actuellement lue
        video.closest('.video-item').classList.add('active');
        video.closest('.video-item').classList.remove('inactive');

        // Afficher l'overlay
        document.getElementById('video-overlay').classList.add('active');
    });

    // Revenir à l'état initial quand la vidéo est en pause ou terminée
    video.addEventListener('pause', resetVideos);
    video.addEventListener('ended', resetVideos);
});

// Fermer la vidéo lorsqu'on clique en dehors
document.getElementById('video-overlay').addEventListener('click', resetVideos);

function resetVideos() {
    document.querySelectorAll('.video-item').forEach(item => {
        item.classList.remove('active', 'inactive');
    });

    // Masquer l'overlay
    document.getElementById('video-overlay').classList.remove('active');
}
function expandVideo(videoElement) {
    const videoOverlay = document.getElementById('video-overlay');

    // Montrer l'overlay et ajuster la vidéo
    videoOverlay.style.display = 'block';
    videoElement.classList.add('video-fullscreen');

    // Scroll bloqué pour éviter que la page défile
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer la vidéo
function closeVideo() {
    const videoOverlay = document.getElementById('video-overlay');
    const fullscreenVideo = document.querySelector('.video-fullscreen');

    if (fullscreenVideo) {
        fullscreenVideo.classList.remove('video-fullscreen');
    }
    videoOverlay.style.display = 'none';

    // Réactiver le défilement
    document.body.style.overflow = 'auto';
}

// Initialisation des interactions après le chargement de la page
document.addEventListener('DOMContentLoaded', initializeProductInteractions);
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

document.addEventListener('DOMContentLoaded', function() {
    var chatPopup = document.getElementById('chat-popup');
    var chatIcon = document.getElementById('chat-icon');
    var chatIframe = document.getElementById('chat-iframe');

    // Fonction pour afficher ou masquer le pop-up du chatbot
    document.getElementById('chat-icon').addEventListener('click', function() {
        if (chatPopup.classList.contains('show')) {
            chatPopup.classList.remove('show');
            setTimeout(function() {
                chatPopup.style.display = 'none';
            }, 300); // Délai pour laisser le temps à l'animation de se terminer
            chatIcon.style.display = 'block';
        } else {
            chatPopup.style.display = 'block';
            setTimeout(function() {
                chatPopup.classList.add('show');
            }, 10); // Délai pour laisser le temps à l'élément de passer en display:block
            chatIcon.style.display = 'none';
        }
    });

    // Événement pour fermer le pop-up du chatbot lorsque l'utilisateur clique en dehors
    window.addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdown-menu');
        if (event.target !== chatPopup && !chatPopup.contains(event.target) && event.target !== chatIcon && !chatIcon.contains(event.target) && event.target !== dropdownMenu && !dropdownMenu.contains(event.target)) {
            chatPopup.classList.remove('show');
            setTimeout(function() {
                chatPopup.style.display = 'none';
            }, 300); // Délai pour laisser le temps à l'animation de se terminer
            chatIcon.style.display = 'block';
            dropdownMenu.style.display = 'none';
        }
    });

    // Fonction pour agrandir ou réduire le pop-up du chatbot
    document.getElementById('expand-button').addEventListener('click', function() {
        if (chatPopup.style.width === '650px') {
            chatPopup.style.width = '400px';
            chatPopup.style.height = '600px';
        } else {
            chatPopup.style.width = '650px';
            chatPopup.style.height = '87%';
        }
    });

    // Fonction pour afficher ou masquer le menu déroulant
    document.getElementById('menu-button').addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
            dropdownMenu.style.display = 'block';
        } else {
            dropdownMenu.style.display = 'none';
        }
        event.stopPropagation();
    });

    // Fonction pour minimiser le pop-up du chatbot
    document.getElementById('minimize-button').addEventListener('click', function() {
        chatPopup.classList.remove('show');
        setTimeout(function() {
            chatPopup.style.display = 'none';
        }, 300); // Délai pour laisser le temps à l'animation de se terminer
        chatIcon.style.display = 'block';
    });

    // Ajuster la hauteur du chatbot sur mobile
    function adjustChatbotHeight() {
        if (isMobileDevice()) {
            const viewportHeight = window.innerHeight;
            chatPopup.style.height = `${viewportHeight}px`;
        }
    }

    // Appeler cette fonction lors du redimensionnement de la fenêtre
    window.addEventListener('resize', adjustChatbotHeight);

    // Appeler cette fonction une fois lors du chargement de la page pour s'assurer que le chatbot est dimensionné correctement
    window.addEventListener('load', adjustChatbotHeight);
});
