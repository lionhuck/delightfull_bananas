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



//Login y Registro


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

// -------------\Script para el carousel 
let currentSlide = 0;
const slideInterval = 3000; // Tiempo en milisegundos entre cada imagen

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function moveSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Cambio automático de fotos
setInterval(moveSlide, slideInterval);

// Mostrar la primera imagen al cargar la página
showSlide(currentSlide);






// -------------SCRIPT PARA CERRAR EL NAV UNA VEZ SELECCIONADA LA SECCIÑÓN 

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


