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
        actualizarInterfazUsuario();
        return usuario;
    } else {
        console.log("Nombre de usuario o contraseña incorrectos");
        return null;
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuario-sesion");
    console.log("Sesión cerrada");
    actualizarInterfazUsuario(); // Actualiza el enlace tras cerrar la sesión
    document.getElementById("popover").style.display = "none"; // Oculta el popover
}

// Función para actualizar la interfaz de usuario
function actualizarInterfazUsuario() {
    const loginLink = document.getElementById("loginLink");
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario-sesion"));
    const popover = document.getElementById("popover");

    if (usuarioSesion) {
        loginLink.textContent = usuarioSesion.nombre; // Mostrar nombre del usuario
        loginLink.href = "#";
        loginLink.onclick = function(event) {
            event.preventDefault();
            popover.style.display = popover.style.display === "none" ? "block" : "none"; // Toggle del popover
        };
    } else {
        loginLink.textContent = "Login / Sign up";
        loginLink.href = "inicio.html"; // Redirige al formulario de inicio
        loginLink.onclick = null; // Elimina el evento de cerrar sesión
        popover.style.display = "none"; // Oculta el popover si no hay sesión
    }
}

// Llamar a actualizarInterfazUsuario cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    actualizarInterfazUsuario();

    // Agregar evento al botón de cerrar sesión en el popover
    document.getElementById("cerrarSesionBtn").addEventListener("click", cerrarSesion);
});
