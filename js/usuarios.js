// Definición de usuarios (esto debería ser reemplazado por una base de datos en una aplicación real)
const usuarios = [
    {
        id: 1,
        nombre: "Admin",
        correo: "admin@example.com",
        password: "admin123",
        roles: ["Administrador"],
    },
    {
        id: 2,
        nombre: "crea",
        correo: "crea@example.com",
        password: "crea",
        roles: ["Creador"],
    },
    {
        id: 3,
        nombre: "dona",
        correo: "dona@example.com",
        password: "dona",
        roles: ["Donador"],
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
    actualizarInterfazUsuario();
    document.dispatchEvent(new Event('sesionCambiada'));
}

// Función para verificar si hay una sesión activa
function verificarSesion() {
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario-sesion'));
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

function actualizarInterfazUsuario() {
    const loginLink = document.getElementById("loginLink");
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario-sesion'));
    const popover = document.getElementById("popover");
    const verCampanasBtn = document.getElementById("verCampanasBtn");
    const verHistorialBtn = document.getElementById("verHistorialBtn");
    const campaignBtn = document.getElementById("campaignBtn");
    const adminBtn = document.getElementById("adminBtn"); // Nuevo botón de administración

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

            // Mostrar opciones según el rol del usuario
            if (verCampanasBtn && verHistorialBtn) {
                if (usuarioSesion.roles.includes("Creador")) {
                    verCampanasBtn.style.display = "block";
                    verHistorialBtn.style.display = "none";
                    if (adminBtn) {
                        adminBtn.style.display = "block"; // Mostrar el botón de administración
                        adminBtn.onclick = function() {
                            window.location.href = 'administracion.html'; // Redirigir a la página de administración
                        };
                    }
                } else if (usuarioSesion.roles.includes("Donador")) {
                    verCampanasBtn.style.display = "none";
                    verHistorialBtn.style.display = "block";
                    if (adminBtn) {
                        adminBtn.style.display = "none"; // Ocultar el botón de administración
                    }
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
            window.location.href = 'ver.html';
            break;
        case "verHistorialBtn":
            window.location.href = 'donacionesH.html';
            break;
        case "cerrarSesionBtn":
            cerrarSesion();
            break;
    }
    // Cerrar el popover después de hacer clic en un botón
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

    // Agregar evento al popover para manejar clics en los botones
    const popover = document.getElementById("popover");
    if (popover) {
        popover.addEventListener("click", manejarClicPopover);
    }

    // Agregar evento al botón de explorar
    const exploreLink = document.getElementById("exploreLink");
    if (exploreLink) {
        exploreLink.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("Explorar campañas");
            // Aquí puedes añadir la lógica para mostrar las campañas
        });
    }

    // Agregar evento a la barra de búsqueda
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", function() {
            console.log("Buscando: " + this.value);
        });
    }
});