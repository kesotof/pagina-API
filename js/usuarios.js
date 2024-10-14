const usuarios = [
    {
        id: 1,
        nombre: "Admin",
        correo: "admin@example.com",
        password: "admin123",
        roles: ["Administrador"]
    },
    {
        id: 2,
        nombre: "crea",
        correo: "crea@example.com",
        password: "crea",
        roles: ["Creador"]
    },
    {
        id: 3,
        nombre: "dona",
        correo: "dona@example.com",
        password: "dona",
        roles: ["Donador"]
    }
];

// Guardar los usuarios en el localStorage solo si aún no están guardados
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
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
    
    // En lugar de redirigir, actualizamos la interfaz
    actualizarInterfazUsuario();
    
    // Si estamos en index.html, actualizamos el contenido visible
    if (window.location.pathname.endsWith('index.html')) {
        const contenidoPrivado = document.getElementById("contenido-privado");
        if (contenidoPrivado) {
            contenidoPrivado.style.display = "none";
        }
        const contenidoPublico = document.getElementById("contenido-publico");
        if (contenidoPublico) {
            contenidoPublico.style.display = "block";
        }
    } else {
        // Si no estamos en index.html, redirigimos a index.html
        window.location.href = 'index.html';
    }
}

// Función para verificar si hay una sesión activa
function verificarSesion() {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario-sesion"));
    const paginaActual = window.location.pathname.split('/').pop();

    if (usuarioSesion) {
        // Si hay una sesión activa
        if (paginaActual === 'inicio.html' || paginaActual === 'registro.html') {
            // Si el usuario está en la página de inicio de sesión o registro, redirigir a index.html
            window.location.href = 'index.html';
        }
    } else {
        // Si no hay sesión activa
        const paginasProtegidas = ['perfil.html', 'dashboard.html']; // Añade aquí las páginas que requieren autenticación
        if (paginasProtegidas.includes(paginaActual)) {
            // Si el usuario intenta acceder a una página protegida, redirigir a inicio.html
            window.location.href = 'inicio.html';
        }
    }
}

// Función para actualizar la interfaz de usuario
function actualizarInterfazUsuario() {
    const loginLink = document.getElementById("loginLink");
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario-sesion"));
    const popover = document.getElementById("popover");

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
        } else {
            loginLink.textContent = "Login / Sign up";
            loginLink.href = "inicio.html";
            loginLink.onclick = null;
            if (popover) {
                popover.style.display = "none";
            }
        }
    }
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
        roles: [rol]
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("Usuario registrado con éxito");
    return true;
}

// Llamar a verificarSesion y actualizarInterfazUsuario cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    verificarSesion();
    actualizarInterfazUsuario();

    // Agregar evento al botón de cerrar sesión en el popover si existe
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", cerrarSesion);
    }
});