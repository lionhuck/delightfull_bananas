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


document.getElementById('formularioRegistro').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('regUsuario').value;
    const contrasena = document.getElementById('regContrasena').value;
    const telefono = document.getElementById('regTelefono').value;
    const direccion = document.getElementById('regDireccion').value;
    const dni = document.getElementById('regDNI').value;

    if (validarRegistro(usuario, contrasena, telefono, direccion, dni)) {
        const nuevoUsuario = {
            id: generarId(),
            usuario,
            contrasena,
            telefono,
            direccion,
            dni
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
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
});

const validarRegistro = (usuario, contrasena, telefono, direccion, dni) => {
    if (!usuario || usuario.length < 5) {
        alert('El nombre de usuario debe tener al menos 5 caracteres.');
        return false;
    }

    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/;
    if (!contrasenaRegex.test(contrasena)) {
        alert('La contraseña debe tener al menos 9 caracteres, incluyendo letras y números.');
        return false;
    }

    if (!telefono || !direccion || !dni) {
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


