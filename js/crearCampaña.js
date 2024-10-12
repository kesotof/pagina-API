// Función para crear una campaña
function crearCampana(event) {
    event.preventDefault(); // Previene el envío tradicional del formulario
    console.log("Iniciando creación de campaña");

    const creator = document.getElementById("creator").value;
    const title = document.getElementById("title").value;
    const descripcion = document.getElementById("descripcion").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;
    const precio = document.getElementById("precio").value;

    console.log("Datos del formulario:", { creator, title, descripcion, category, image, precio });

    let campanas = [];
    try {
        const campanasString = localStorage.getItem("campañas");
        console.log("Campañas en localStorage:", campanasString);
        campanas = JSON.parse(campanasString) || [];
    } catch (error) {
        console.error("Error al parsear campañas:", error);
        campanas = [];
    }
    console.log("Campañas existentes:", campanas);

    const nuevaCampana = {
        id: Date.now(),
        title,
        creator,
        descripcion,
        category,
        image,
        precio: parseFloat(precio),
        funded: 0
    };
    console.log("Nueva campaña a crear:", nuevaCampana);

    campanas.push(nuevaCampana);
    console.log("Campañas actualizadas:", campanas);

    try {
        localStorage.setItem("campañas", JSON.stringify(campanas));
        console.log("Campañas guardadas en localStorage");
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
    }

    console.log("Verificando guardado:");
    console.log("Campañas en localStorage después de guardar:", localStorage.getItem("campañas"));

    alert("Campaña creada exitosamente.");
    document.getElementById("campana-form").reset();
}

// Agregar el event listener al formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("campana-form");
    form.addEventListener("submit", crearCampana);
    
    console.log("Event listener agregado al formulario");
    console.log("Contenido actual de localStorage:", localStorage.getItem("campañas"));
});

// Función para mostrar todo el contenido de localStorage
function mostrarLocalStorage() {
    console.log("Contenido completo de localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key, ":", localStorage.getItem(key));
    }
}

// Llamar a la función al cargar la página
mostrarLocalStorage();

// Verificar si el usuario es creador al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    console.log("Página cargada, verificando si es creador");
    if (!esCreador()) {
        console.log("No es creador, redirigiendo");
        alert("No tienes permiso para crear campañas. Serás redirigido a la página de inicio.");
        window.location.href = "inicio.html";
    } else {
        console.log("Es creador, puede crear campañas");
    }
});

// Función para verificar si es creador
function esCreador() {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario-sesion"));
    console.log("Usuario en sesión:", usuarioSesion);
    return usuarioSesion && usuarioSesion.roles && usuarioSesion.roles.includes("Creador");
}

// Mostrar el contenido actual de localStorage al cargar la página
console.log("Contenido actual de localStorage:", localStorage.getItem("campañas"));