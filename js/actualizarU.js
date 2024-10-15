// Obtener el usuario actual de localStorage
let usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));

// Función para actualizar los datos del usuario en el localStorage
function actualizarDatosUsuario() {
    localStorage.setItem('usuario-sesion', JSON.stringify(usuarioActual));
}

// Función para manejar el clic en los botones del menú
function manejarClicMenu(event) {
    const botonClickeado = event.target.closest('.boton-menu');
    if (!botonClickeado) return; // Si no se hizo clic en un botón, salir de la función

    const botonId = botonClickeado.id;
    
    // Remover la clase 'active' de todos los botones
    document.querySelectorAll('.boton-menu').forEach(boton => {
        boton.classList.remove('active');
    });

    // Añadir la clase 'active' al botón clickeado
    botonClickeado.classList.add('active');

    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });

    // Mostrar la sección correspondiente al botón clickeado
    switch(botonId) {
        case 'Nombre':
            document.getElementById('seccionNombre').style.display = 'block';
            break;
        case 'telefono':
            document.getElementById('seccionTelefono').style.display = 'block';
            break;
        case 'correo':
            document.getElementById('seccionCorreo').style.display = 'block';
            break;
        case 'Contraseña':
            document.getElementById('seccionContrasena').style.display = 'block';
            break;
        case 'Eliminar cuenta':
            document.getElementById('seccionEliminar').style.display = 'block';
            break;
    }
}

// Función para actualizar el array de usuarios en localStorage
function actualizarArrayUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const index = usuarios.findIndex(user => user.id === usuarioActual.id);
    if (index !== -1) {
        usuarios[index] = usuarioActual; // Reemplaza el usuario modificado
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

// Función para guardar el nombre
function guardarNombre(event) {
    event.preventDefault();
    const nuevoNombreInput = document.getElementById('nuevoNombre');
    const nuevoNombre = nuevoNombreInput.value;
    if (nuevoNombre) {
        usuarioActual.nombre = nuevoNombre;
        actualizarArrayUsuarios();
        actualizarDatosUsuario();
        actualizarInterfazUsuario();
        alert('Nombre actualizado con éxito');
        nuevoNombreInput.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Por favor ingresa un nombre válido');
    }
}

// Función para guardar el teléfono
function guardarTelefono(event) {
    event.preventDefault();
    const nuevoTelefonoInput = document.getElementById('nuevoTelefono');
    const nuevoTelefono = nuevoTelefonoInput.value;
    usuarioActual.telefono = nuevoTelefono;
    actualizarArrayUsuarios();
    actualizarDatosUsuario();
    actualizarInterfazUsuario();
    alert('Teléfono actualizado con éxito');
    nuevoTelefonoInput.value = ''; // Limpiar el campo de entrada
}

function guardarCorreo(event) {
    event.preventDefault();
    const nuevoCorreoInput = document.getElementById('nuevoCorreo');
    const nuevoCorreo = nuevoCorreoInput.value;
    usuarioActual.correo = nuevoCorreo;
    actualizarArrayUsuarios();
    actualizarDatosUsuario();
    actualizarInterfazUsuario();
    alert('Correo actualizado con éxito');
    nuevoCorreoInput.value = ''; // Limpiar el campo de entrada
}

// Función para cambiar la contraseña
function cambiarContrasena(event) {
    event.preventDefault();
    const contrasenaActualInput = document.getElementById('contrasenaActual');
    const nuevaContrasenaInput = document.getElementById('nuevaContrasena');
    const contrasenaActual = contrasenaActualInput.value;
    const nuevaContrasena = nuevaContrasenaInput.value;

    if (contrasenaActual !== usuarioActual.password) {
        alert('La contraseña actual es incorrecta.');
        return;
    }

    if (nuevaContrasena) {
        usuarioActual.password = nuevaContrasena;
        actualizarArrayUsuarios();
        actualizarDatosUsuario();
        alert('Contraseña actualizada con éxito');
        contrasenaActualInput.value = ''; // Limpiar el campo de entrada
        nuevaContrasenaInput.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Por favor ingresa una nueva contraseña válida');
    }
}

// Función para eliminar la cuenta
function eliminarCuenta(event) {
    event.preventDefault();
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios"));
        const index = usuarios.findIndex(user => user.id === usuarioActual.id);
        if (index !== -1) {
            usuarios.splice(index, 1);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }
        localStorage.removeItem('usuario-sesion');
        alert('Cuenta eliminada con éxito.');
        window.location.href = 'index.html';
    }
}

// Función para iniciar sesión
function iniciarSesion(nombre, password) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const usuario = usuarios.find(user => user.nombre === nombre && user.password === password);

    if (usuario) {
        localStorage.setItem("usuario-sesion", JSON.stringify(usuario));
        console.log("Inicio de sesión exitoso");
        return true;
    } else {
        console.log("Nombre de usuario o contraseña incorrectos");
        return false;
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuario-sesion");
    console.log("Sesión cerrada");
    actualizarInterfazUsuario();
    document.dispatchEvent(new Event('sesionCambiada'));
}

// Función para verificar si hay una sesión activa
function verificarSesion() {
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario-sesion'));
    const paginaActual = window.location.pathname.split('/').pop();

    if (usuarioSesion) {
        if (paginaActual === 'inicio.html' || paginaActual === 'registro.html') {
            window.location.href = 'index.html';
        }
    } else {
        const paginasProtegidas = ['perfil.html', 'dashboard.html'];
        if (paginasProtegidas.includes(paginaActual)) {
            window.location.href = 'inicio.html';
        }
    }
}

// Función para actualizar la interfaz de usuario
function actualizarInterfazUsuario() {
    const loginLink = document.getElementById("loginLink");
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario-sesion'));
    const popover = document.getElementById("popover");
    const verCampanasBtn = document.getElementById("verCampanasBtn");
    const verHistorialBtn = document.getElementById("verHistorialBtn");
    const campaignBtn = document.getElementById("campaignBtn");

    if (loginLink) {
        if (usuarioSesion) {
            loginLink.textContent = usuarioSesion.nombre;
            loginLink.href = "#";
            loginLink.onclick = function(event) {
                event.preventDefault();
                if (popover) {
                    popover.style.display = popover.style.display === "none" ? "block" : "none";
                }
            };

            if (verCampanasBtn && verHistorialBtn) {
                if (usuarioSesion.roles.includes("Creador")) {
                    verCampanasBtn.style.display = "block";
                    verHistorialBtn.style.display = "none";
                } else if (usuarioSesion.roles.includes("Donador")) {
                    verCampanasBtn.style.display = "none";
                    verHistorialBtn.style.display = "block";
                }
            }
        } else {
            loginLink.textContent = "Login / Sign up";
            loginLink.href = "inicio.html";
            loginLink.onclick = null;
            if (popover) {
                popover.style.display = "none";
            }
        }
    }

    if (campaignBtn) {
        campaignBtn.style.display = "block";
        campaignBtn.onclick = function() {
            if (usuarioSesion && usuarioSesion.roles.includes("Creador")) {
                window.location.href = 'crear_campana.html';
            } else {
                alert("No tienes el rol para crear una campaña. Tienes que ser creador.");
            }
        };
    }
}

// Función para manejar el clic en los botones del popover
function manejarClicPopover(event) {
    const botonId = event.target.id;
    switch(botonId) {
        case "editarPerfilBtn":
            window.location.href = 'editarP.html';
            break;
        case "verCampanasBtn":
            window.location.href = 'mis_campanas.html';
            break;
        case "verHistorialBtn":
            window.location.href = 'historial_donaciones.html';
            break;
        case "cerrarSesionBtn":
            cerrarSesion();
            break;
    }
    document.getElementById("popover").style.display = "none";
}

// Función para registrar un nuevo usuario
function registrarUsuario(nombre, correo, password, rol) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    
    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre,
        correo: correo,
        password: password,
        roles: [rol],
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("Usuario registrado con éxito");
    return true;
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    verificarSesion();
    actualizarInterfazUsuario();

    const popover = document.getElementById("popover");
    if (popover) {
        popover.addEventListener("click", manejarClicPopover);
    }

    const exploreLink = document.getElementById("exploreLink");
    if (exploreLink) {
        exploreLink.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Explorar campañas");
        });
    }

    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", function() {
            console.log("Buscando: " + this.value);
        });
    }

    // Agregar eventos a los botones del menú de edición de perfil
    document.querySelectorAll('.boton-menu').forEach(boton => {
        boton.addEventListener('click', manejarClicMenu);
    });

    // Agregar eventos a los formularios de edición de perfil
    const formNombre = document.getElementById('formNombre');
    if (formNombre) formNombre.addEventListener('submit', guardarNombre);

    const formTelefono = document.getElementById('formTelefono');
    if (formTelefono) formTelefono.addEventListener('submit', guardarTelefono);

    const formCorreo = document.getElementById('formCorreo');
    if (formCorreo) formCorreo.addEventListener('submit', guardarCorreo);

    const formContrasena = document.getElementById('formContrasena');
    if (formContrasena) formContrasena.addEventListener('submit', cambiarContrasena);

    const formEliminar = document.getElementById('formEliminar');
    if (formEliminar) formEliminar.addEventListener('submit', eliminarCuenta);

    // Mostrar la sección de Nombre por defecto en la página de edición de perfil
    const seccionNombre = document.getElementById('seccionNombre');
    if (seccionNombre) seccionNombre.style.display = 'block';
});