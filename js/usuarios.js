// Definición de usuarios (esto debería ser reemplazado por una base de datos en una aplicación real)
const usuarios = [
    {
        id: 1,
        nombre: "Admin",
        correo: "admin@example.com",
        password: "admin123",
        roles: ["Administrador"],
        imagenPerfil: null
    },
    {
        id: 2,
        nombre: "crea",
        correo: "crea@example.com",
        password: "crea",
        roles: ["Creador"],
        imagenPerfil: null
    },
    {
        id: 3,
        nombre: "dona",
        correo: "dona@example.com",
        password: "dona",
        roles: ["Donador"],
        imagenPerfil: null
    }
];

// Guardar los usuarios en el localStorage solo si aún no están guardados
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Función para actualizar la imagen del usuario en todas las páginas
function actualizarImagenUsuario() {
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario-sesion'));
    const userImage = document.getElementById('userImage');
    if (userImage) {
        if (usuarioSesion && usuarioSesion.imagenPerfil) {
            userImage.src = usuarioSesion.imagenPerfil;
        } else {
            userImage.src = 'default-profile.png';
        }
    }
}

// Función para iniciar sesión
function iniciarSesion(nombre, password) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const usuario = usuarios.find(user => user.nombre === nombre && user.password === password);

    if (usuario) {
        localStorage.setItem("usuario-sesion", JSON.stringify(usuario));
        console.log("Inicio de sesión exitoso");
        actualizarImagenUsuario();
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

            // Mostrar opciones según el rol del usuario
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

    // Mostrar el botón de iniciar campaña para todos
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

    actualizarImagenUsuario();
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
        imagenPerfil: null
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("Usuario registrado con éxito");
    return true;
}

// Función para actualizar el perfil del usuario
function actualizarPerfil(event) {
    event.preventDefault();
    
    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
    const nombreInput = document.getElementById('nombre');
    const imagenInput = document.getElementById('imagenPerfil');
    const passwordActual = document.getElementById('passwordActual').value;
    const nuevaPassword = document.getElementById('nuevaPassword').value;
    const confirmarPassword = document.getElementById('confirmarPassword').value;

    // Verificar la contraseña actual
    if (passwordActual !== usuarioActual.password) {
        alert('La contraseña actual es incorrecta.');
        return;
    }

    // Verificar si las nuevas contraseñas coinciden
    if (nuevaPassword !== confirmarPassword) {
        alert('Las nuevas contraseñas no coinciden.');
        return;
    }

    // Actualizar el nombre
    usuarioActual.nombre = nombreInput.value;

    // Actualizar la contraseña si se proporcionó una nueva
    if (nuevaPassword) {
        usuarioActual.password = nuevaPassword;
    }

    // Actualizar la imagen de perfil si se seleccionó una nueva
    if (imagenInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            usuarioActual.imagenPerfil = e.target.result;
            actualizarUsuario(usuarioActual);
        };
        reader.readAsDataURL(imagenInput.files[0]);
    } else {
        actualizarUsuario(usuarioActual);
    }
}

function actualizarUsuario(usuarioActualizado) {
    // Actualizar el usuario en el localStorage
    localStorage.setItem('usuario-sesion', JSON.stringify(usuarioActualizado));

    // Actualizar el usuario en la lista de usuarios
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const index = usuarios.findIndex(u => u.id === usuarioActualizado.id);
    if (index !== -1) {
        usuarios[index] = usuarioActualizado;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    alert('Perfil actualizado con éxito.');
    // Actualizar la imagen del usuario en la página actual
    actualizarImagenUsuario();
    // Redirigir al usuario a la página principal o de perfil
    window.location.href = 'index.html';
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
            // Aquí puedes añadir la lógica para buscar campañas
        });
    }

    // Agregar evento al formulario de edición de perfil
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', actualizarPerfil);

        // Cargar datos del usuario actual en el formulario
        const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
        if (usuarioActual) {
            document.getElementById('nombre').value = usuarioActual.nombre;
            const previewImagen = document.getElementById('previewImagen');
            if (usuarioActual.imagenPerfil) {
                previewImagen.src = usuarioActual.imagenPerfil;
                previewImagen.style.display = 'block';
            } else {
                previewImagen.src = 'default-profile.png';
                previewImagen.style.display = 'block';
            }
        }

        // Previsualizar la imagen seleccionada
        const imagenInput = document.getElementById('imagenPerfil');
        imagenInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImagen').src = e.target.result;
                    document.getElementById('previewImagen').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});