// Obtener el usuario actual de localStorage
let usuarioActual = JSON.parse(localStorage.getItem('usuarios'));

// Función para actualizar los datos del usuario en el localStorage
function actualizarDatosUsuario() {
    localStorage.setItem('usuarios', JSON.stringify(usuarioActual));
}

// Función para manejar el clic en los botones del menú
function manejarClicMenu(event) {
    const botonId = event.target.id;
    
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

// Modificar las funciones de guardar para actualizar el array
function guardarNombre(event) {
    event.preventDefault();
    const nuevoNombre = document.getElementById('nuevoNombre').value;
    if (nuevoNombre) {
        usuarioActual.nombre = nuevoNombre;
        actualizarArrayUsuarios();
        alert('Nombre actualizado con éxito');
    } else {
        alert('Por favor ingresa un nombre válido');
    }
}

function guardarTelefono(event) {
    event.preventDefault();
    const nuevoTelefono = document.getElementById('nuevoTelefono').value;
    usuarioActual.telefono = nuevoTelefono;
    actualizarArrayUsuarios();
    alert('Teléfono actualizado con éxito');
}

function guardarCorreo(event) {
    event.preventDefault();
    const nuevoCorreo = document.getElementById('nuevoCorreo').value;
    usuarioActual.correo = nuevoCorreo;
    actualizarArrayUsuarios();
    alert('Correo actualizado con éxito');
}

function cambiarContrasena(event) {
    event.preventDefault();
    const contrasenaActual = document.getElementById('contrasenaActual').value;
    const nuevaContrasena = document.getElementById('nuevaContrasena').value;

    if (contrasenaActual !== usuarioActual.password) {
        alert('La contraseña actual es incorrecta.');
        return;
    }

    if (nuevaContrasena) {
        usuarioActual.password = nuevaContrasena;
        actualizarArrayUsuarios();
        alert('Contraseña actualizada con éxito');
    } else {
        alert('Por favor ingresa una nueva contraseña válida');
    }
}


// Función para eliminar la cuenta
function eliminarCuenta(event) {
    event.preventDefault();
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
        // Eliminar el usuario de localStorage
        localStorage.removeItem('usuario-sesion');
        alert('Cuenta eliminada con éxito.');
        // Redirigir a la página de inicio
        window.location.href = 'index.html';
    }
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar el usuario actual
    usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
    
    // Agregar eventos a los botones del menú
    document.querySelectorAll('.boton-menu').forEach(boton => {
        boton.addEventListener('click', manejarClicMenu);
    });

    // Secciones de edición de perfil
    document.getElementById('formNombre').addEventListener('submit', guardarNombre);
    document.getElementById('formTelefono').addEventListener('submit', guardarTelefono);
    document.getElementById('formCorreo').addEventListener('submit', guardarCorreo);
    document.getElementById('formContrasena').addEventListener('submit', cambiarContrasena);
    document.getElementById('formEliminar').addEventListener('submit', eliminarCuenta);

    // Mostrar la sección de Nombre por defecto
    document.getElementById('seccionNombre').style.display = 'block';
});