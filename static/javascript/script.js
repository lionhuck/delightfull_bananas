//-------------- Compartir ubicacion -----------------


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("share-location").addEventListener("click", function() {
        // Define la URL de la ubicación que quieres compartir
        const locationURL = "https://maps.app.goo.gl/yL82Qrad6rf77WRs6";

        // Crea el mensaje con la ubicación
        const message = `Vení a disfrutar la experiencia Vares. Estamos aquí: ${locationURL}`;
        
        // Codifica el mensaje para que sea seguro en la URL
        const encodedMessage = encodeURIComponent(message);
        
        // Crea el enlace para WhatsApp
        const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
        
        // Abre WhatsApp en una nueva ventana o pestaña
        window.open(whatsappURL, '_blank');
    });
});



// -------------- Index -----------------
let lastClickedContainer = null;

document.querySelectorAll('.image-container').forEach(container => {
    let clickCount = 0;
    container.addEventListener('click', function() {
        if (lastClickedContainer && lastClickedContainer !== this) {
        // Restablece el último contenedor clicado al estado original
        resetContainer(lastClickedContainer);
        lastClickedContainer = null;
        }
        
        clickCount++;
        
        if (clickCount === 1) {
        // Primer clic: aplicar efecto hover
        this.querySelector('.image-wrapper img').style.transform = 'scale(1.07)';
        this.querySelector('.title-overlay h3').style.opacity = '0';
        this.querySelector('.title-overlay').style.backgroundColor = 'transparent';
        lastClickedContainer = this;
        } else if (clickCount === 2) {
        // Segundo clic: redirigir a la URL
        window.location.href = this.dataset.url;
        }
    });

    // Reiniciar el contador después de un tiempo
    container.addEventListener('transitionend', function() {
        setTimeout(() => { clickCount = 0; }, 1000);
    });
});

function resetContainer(container) {
    container.querySelector('.image-wrapper img').style.transform = 'scale(1)';
    container.querySelector('.title-overlay h3').style.opacity = '1';
    container.querySelector('.title-overlay').style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
}

// -------------Cerrar el nav una vez seleccionada la sección

document.querySelectorAll('.offcanvas a').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
    const offcanvasElement = document.querySelector('.offcanvas');
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);

    // Cerrar el offcanvas
    offcanvasInstance.hide();

    // Esperar un poco antes de permitir el comportamiento del enlace
    setTimeout(() => {
        if (anchor.getAttribute('href').startsWith('#')) {
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        } else {
        window.location.href = anchor.getAttribute('href');
        }
    }, 300);
    });
});

// -------------Agregar un producto al carrito
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verifica si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualiza el contador del carrito
    updateCartCount();
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartCountElement = document.getElementById('cart-count'); // Asegúrate de que el elemento con el id 'cart-count' exista

    if (cartCount > 0) {
        cartCountElement.textContent = cartCount; // Muestra el número total de productos
        cartCountElement.style.display = 'inline'; // Asegúrate de que el contador sea visible
    } else {
        cartCountElement.style.display = 'none'; // Oculta el contador cuando el carrito esté vacío
    }
}


// Cargar el carrito y actualizar el contador cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
        updateCartCount(cart.length);
    } else {
        updateCartCount(0);
    }
});

// Función para cargar el carrito
function loadCart() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];

    cartTableBody.innerHTML = ''; // Limpiar la tabla antes de cargar

    cartItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.classList.add('table-dark');

        row.innerHTML = `
            <td style="width: 50px;"><img src="${item.image}" alt="" style="width: 50px; border-radius: 10%;"></td>
            <td style="max-width: 120px;">${item.name}</td>
            <td style="white-space: nowrap;">
                <button type="button" class="btn btn-secondary btn-sm" style="font-size: 1.2rem;" onclick="updateQuantity(${index}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <input type="number" min="1" value="${item.quantity}" class="form-control d-inline" style="width: 50px;" step="1" onchange="updateQuantity(${index}, this.value)">
                <button type="button" class="btn btn-secondary btn-sm" style="font-size: 1.2rem;" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
            </td>
            <td style="width: 70px;">$${item.price * item.quantity}</td>
            <td style="width: 40px;"><button type="button" class="btn btn-danger btn-sm" style="font-size: 1.5rem;" onclick="removeFromCart(${index})">X</button></td>
        `;

        cartTableBody.appendChild(row);
    });

    updateTotals(cartItems); // Actualizar los totales del carrito
    updateCartCount(cartItems.length); // Asegurarse de actualizar el contador aquí también
}

// Función para actualizar cantidades en el carrito
function updateQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart'));

    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Recargar el carrito
}

// Función para eliminar producto del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1); // Eliminar el producto del array
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Recargar el carrito
}

// Función para actualizar los totales de la compra
function updateTotals() {
    let cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    
    let subtotal = 0;

    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const discount = subtotal * 0.10; // 10% descuento en efectivo
    const total = subtotal - discount;

    const subtotalElement = document.querySelector('.subtotal td:nth-child(2)');
    const discountElement = document.querySelector('.descuento td:nth-child(2)');
    const totalElement = document.querySelector('.total td:nth-child(2)');
    const pagarButton = document.getElementById('pagar');

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discount.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Desactivar el botón si el total es 0
    if (total <= 0) {
        pagarButton.setAttribute('disabled', 'disabled');
    } else {
        pagarButton.removeAttribute('disabled');
    }
}

// Cargar el carrito cuando el DOM esté listo 
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
// Esto sirve para que muestre la cantidad de productos en el icono del carrito en los otros templates)   
});

// Función para cargar los detalles de la compra en un Storage diferente
function loadPurchaseDetails() {

    // Obtenemos los datos del carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Guardar los datos del carrito en una clave diferente para futuros usos
    localStorage.setItem('saved_cart', JSON.stringify(cart));

}

function showSavedCart() {
    // Seleccionamos los elementos donde vamos a mostrar los datos
    const savedTableBody = document.querySelector("#saved-cart-table tbody");
    const savedTotalElement = document.querySelector(".saved-total td:nth-child(2)");

    // Obtenemos los datos guardados desde localStorage
    const savedCart = JSON.parse(localStorage.getItem('saved_cart')) || [];
    let total = 0;

    // Iteramos sobre los productos y los agregamos a la tabla
    savedCart.forEach(item => {
        const row = document.createElement("tr");

        // Creamos las celdas para el título, cantidad, y el precio
        const titleCell = document.createElement("td");
        titleCell.textContent = item.name; // Nombre del producto

        const quantityCell = document.createElement("td");
        quantityCell.textContent = `${item.quantity}`; // Cantidad de productos

        const priceCell = document.createElement("td");
        priceCell.textContent = `$${item.price * item.quantity}`; // Precio total por producto (precio * cantidad)
        priceCell.classList.add("text-end");

        // Agregamos las celdas a la fila
        row.appendChild(titleCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);

        // Agregamos la fila a la tabla
        savedTableBody.appendChild(row);

        // Actualizamos el total (precio por cantidad)
        total += parseFloat(item.price) * item.quantity;
    });

    // Mostramos el total
    savedTotalElement.textContent = `$${total.toFixed(2)}`;
    
}

// Cargar el carrito y el contador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#cart-table')) {
        loadCart();
    }

    if (document.querySelector("#saved-cart-table")) {
        showSavedCart();
    }

    updateCartCount();
});

// Función para vaciar el carrito al hacer clic en el botón "Ir a pagar"
document.getElementById('pagar')?.addEventListener('click', function() {
    loadPurchaseDetails(); // Guardar los detalles del carrito
    localStorage.removeItem('cart'); // Vaciar el carrito actual
    loadCart(); // Recargar el carrito (debe estar vacío)
    updateCartCount(0); // Actualizar el contador del carrito
});


// -----------------

document.getElementById('formularioRegistro').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('regNombre').value;
    const apellido = document.getElementById('regApellido').value;
    const dni = document.getElementById('regDNI').value;
    const telefono = document.getElementById('regTelefono').value;
    const email = document.getElementById('regEmail').value;
    const usuario = document.getElementById('regUsuario').value;
    const contrasena = document.getElementById('regContrasena').value;    
    const contrasenaRepeted = document.getElementById('regContrasenaRepeted').value;

    if (validarRegistro(nombre, apellido, dni, telefono, email, usuario, contrasena,contrasenaRepeted)) {
        const nuevoUsuario = {
            id: generarId(),
            nombre,
            apellido,
            telefono,
            dni,
            email,
            usuario,
            contrasena,
            contrasenaRepeted
        };
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Usuario registrado exitosamente.');
        document.getElementById('formularioRegistro').reset();
        window.location.href = '/index';
    }
});

document.getElementById('formularioInicioSesion').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('loginUsuario').value;
    const contrasena = document.getElementById('loginContrasena').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

    if (usuarioEncontrado) {
        sessionStorage.setItem('usuarioActual', JSON.stringify({ usuario }));
        // alert('Inicio de sesión exitoso.');
        document.getElementById('formularioInicioSesion').reset();
        window.location.href = '/index';
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
});

const validarRegistro = (nombre,apellido,telefono,dni,email,usuario,contrasena,contrasenaRepeted) => {
    if (!usuario || usuario.length < 5) {
        alert('El nombre de usuario debe tener al menos 5 caracteres.');
        return false;
    }

    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
    if (!contrasenaRegex.test(contrasena)) {
        alert('La contraseña debe tener al menos 7 caracteres, incluyendo letras y números.');
        return false;
    }

    if (!nombre || !apellido || !telefono || !dni || !email ) {
        alert('Por favor, completa todos los campos.');
        return false;
    }
    if (contrasena !== contrasenaRepeted) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    return true;

}

function generarId() {
    let id = localStorage.getItem('idUsuario') || '0';
    id = parseInt(id) + 1;
    localStorage.setItem('idUsuario', id.toString());
    return id;
}



// Codigo para recuperar contraseña

document.getElementById('formularioRecuperarContrasena').addEventListener('submit', function (event) {
    event.preventDefault();

    const recEmail = document.getElementById('recEmail').value;
    const recDni = document.getElementById('recDni').value;

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuarios.find(usuario => usuario.email === recEmail && usuario.dni === recDni);

    if (usuarioEncontrado) {
        alert(`Su contraseña es: ${usuarioEncontrado.contrasena}`);
        window.location.href = '/?showLoginModal=true';
    } else {
        alert('El correo electrónico o el documento no coinciden con ningún usuario registrado.');
    }
});

//Este codigo hace que javascript tenga la ubicacion del modal login una vez recuperaste la contraseñaaaaaa
window.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const showLoginModal = urlParams.get('showLoginModal');

    if (showLoginModal === 'true') {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }
});





