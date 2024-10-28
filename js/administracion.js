// Función para eliminar una campaña
function eliminarCampana(id) {
    let campanas = JSON.parse(localStorage.getItem("campanas")) || [];
    campanas = campanas.filter(campana => campana.id !== id);
    localStorage.setItem("campanas", JSON.stringify(campanas));
    alert("Campaña eliminada con éxito");
    actualizarInterfazAdministracion();
}

// Función para eliminar un comentario
function eliminarComentario(id) {
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios = comentarios.filter(comentario => comentario.id !== id);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
    alert("Comentario eliminado con éxito");
    actualizarInterfazAdministracion();
}

// Función para eliminar una donación del historial
function eliminarDonacion(id) {
    let donaciones = JSON.parse(localStorage.getItem("historialDonaciones")) || [];
    donaciones = donaciones.filter(donacion => donacion.id !== id);
    localStorage.setItem("historialDonaciones", JSON.stringify(donaciones));
    alert("Donación eliminada con éxito");
    actualizarInterfazAdministracion();
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(usuario => usuario.id !== id);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario eliminado con éxito");
    actualizarInterfazAdministracion();
}

// Función para actualizar la interfaz de administración
function actualizarInterfazAdministracion() {
    // Actualizar la lista de campañas
    const campanas = JSON.parse(localStorage.getItem("campanas")) || [];
    const campanasList = document.getElementById("campanasList");
    campanasList.innerHTML = "";
    campanas.forEach(campana => {
        const li = document.createElement("li");
        li.textContent = campana.nombre;
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => eliminarCampana(campana.id);
        li.appendChild(btn);
        campanasList.appendChild(li);
    });

    // Actualizar la lista de comentarios
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    const comentariosList = document.getElementById("comentariosList");
    comentariosList.innerHTML = "";
    comentarios.forEach(comentario => {
        const li = document.createElement("li");
        li.textContent = comentario.texto;
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => eliminarComentario(comentario.id);
        li.appendChild(btn);
        comentariosList.appendChild(li);
    });

    // Actualizar la lista de donaciones
    const donaciones = JSON.parse(localStorage.getItem("historialDonaciones")) || [];
    const donacionesList = document.getElementById("donacionesList");
    donacionesList.innerHTML = "";
    donaciones.forEach(donacion => {
        const li = document.createElement("li");
        li.textContent = `Donación de ${donacion.cantidad} por ${donacion.usuario}`;
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => eliminarDonacion(donacion.id);
        li.appendChild(btn);
        donacionesList.appendChild(li);
    });

    // Actualizar la lista de usuarios
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuariosList = document.getElementById("usuariosList");
    usuariosList.innerHTML = "";
    usuarios.forEach(usuario => {
        const li = document.createElement("li");
        li.textContent = usuario.nombre;
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => eliminarUsuario(usuario.id);
        li.appendChild(btn);
        usuariosList.appendChild(li);
    });
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
        case 'gestionCampanas':
            document.getElementById('seccionCampanas').style.display = 'block';
            break;
        case 'gestionComentarios':
            document.getElementById('seccionComentarios').style.display = 'block';
            break;
        case 'historialDonaciones':
            document.getElementById('seccionDonaciones').style.display = 'block';
            break;
        case 'gestionUsuarios':
            document.getElementById('seccionUsuarios').style.display = 'block';
            break;
    }
}

// Inicializar la interfaz de administración al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazAdministracion();
    document.querySelectorAll('.boton-menu').forEach(boton => {
        boton.addEventListener('click', manejarClicMenu);
    });
});