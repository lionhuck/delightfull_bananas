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
    document.getElementById('cart-count').textContent = cartCount;
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

    if (cart) {
        const cartItems = JSON.parse(cart);
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

        updateTotals(cartItems);
        updateCartCount(cartItems.length); // Asegurarse de actualizar el contador aquí también
    } else {
        updateCartCount(0);
    }
}

// Función para actualizar cantidades en el carrito
function updateQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart'));

    if (newQuantity <= 0) {
        removeFromCart(index); // Si la cantidad es 0 o menor, eliminar el producto
    } else {
        cart[index].quantity = parseInt(newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Recargar el carrito
    }
}

// Función para eliminar producto del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1); // Eliminar el producto del array
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Recargar el carrito
}

// Función para actualizar los totales de la compra
function updateTotals(cartItems) {
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const discount = subtotal * 0.10; // Descuento del 10%
    const total = subtotal - discount;

    document.querySelector('.subtotal td:nth-child(2)').textContent = `$${subtotal}`;
    document.querySelector('.descuento td:nth-child(2)').textContent = `-$${discount.toFixed(2)}`;
    document.querySelector('.total td:nth-child(2)').textContent = `$${total.toFixed(2)}`;
}
// Cargar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
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
        alert('Inicio de sesión exitoso.');
        document.getElementById('formularioInicioSesion').reset();
        window.location.href = '/index';
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
});

const validarRegistro = (nombre, apellido, telefono, direccion, dni, usuario, contrasena) => {
    if (!usuario || usuario.length < 5) {
        alert('El nombre de usuario debe tener al menos 5 caracteres.');
        return false;
    }

    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/;
    if (!contrasenaRegex.test(contrasena)) {
        alert('La contraseña debe tener al menos 9 caracteres, incluyendo letras y números.');
        return false;
    }

    if (!nombre || !apellido || !telefono || !direccion || !dni) {
        alert('Por favor, completa todos los campos.');
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





// otra opción:
// agregar a cada .image-container: data-url="pagina1.html"

// document.querySelectorAll('.image-container').forEach(container => {
// container.addEventListener('click', function() {
//     Espera un momento para que el efecto hover se complete
//     setTimeout(() => {
//     window.location.href = this.dataset.url;
//     }, 200); // Ajusta el tiempo si es necesario
// });
// });


