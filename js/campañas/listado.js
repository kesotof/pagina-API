const proyectosIniciales = [
    { redirect: "/campañas/nitroPreess.html", title: "Máquinas NitroPress", creator: "NitroPress®", image: "/image/proyectosD/nitro.jpg", funded: 60, category: "Tecnología", goal: 10 },
    { redirect: "", title: "Rayman® The Board Game", creator: "Flyos Games", image: "/image/proyectosD/rayman.jpg", funded: 43, category: "Juegos", goal: 10 },
    { redirect: "", title: "Lezo", creator: "lezocomic", image: "/image/proyectosD/lezo.jpg", funded: 33, category: "Cómics & manga", goal: 10 },
    { redirect: "", title: "Solar Card", creator: "Solarballs", image: "/image/proyectosD/solar.jpg", funded: 27, category: "Tecnología", goal: 10 },
    { redirect: "", title: "Disk Plus", creator: "Sharge Tech", image: "/image/proyectosD/disk.jpg", funded: 24, category: "Tecnología", goal: 10 },
    { redirect: "", title: "Papadum y la tarta", creator: "Mike Bonales", image: "/image/proyectosD/papadum.jpg", funded: 21, category: "Cómics & manga", goal: 10 },
    { redirect: "", title: "Twisted Cryptids", creator: "Ramy Badie", image: "/image/proyectosD/twisted.jpg", funded: 18, category: "Juegos", goal: 10 },
    { redirect: "", title: "Lymow One", creator: "Lymow Tech", image: "/image/proyectosD/robot.jpg", funded: 15, category: "Tecnología", goal: 10 }
];

let currentCategory = "Todos";

// Función para cargar las campañas desde un archivo JSON
async function cargarCampanasJSON() {
    try {
        const response = await fetch("/js/campañas.json");
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar las campañas:", error);
        return [];
    }
}

// Función para cargar las campañas guardadas en el localStorage
function cargarCampanasLocal() {
    return JSON.parse(localStorage.getItem("campañas")) || [];
}

// Función para combinar todas las campañas (iniciales, JSON y locales)
async function cargarProyectos() {
    const campañasJSON = await cargarCampanasJSON();
    const campañasLocal = cargarCampanasLocal();
    return [...proyectosIniciales, ...campañasJSON, ...campañasLocal];
}

// Filtrar proyectos según la categoría seleccionada
async function filtrarProyectos(categoria) {
    const contenedor = document.getElementById('campanas-container');
    contenedor.innerHTML = '';

    const proyectos = await cargarProyectos();
    let proyectosFiltrados = proyectos;

    if (categoria !== "Todos") {
        proyectosFiltrados = proyectos.filter(proyecto => {
            if (categoria === "Tecnología" && proyecto.category === "Tecnología") return true;
            if (categoria === "Juegos" && proyecto.category === "Juegos") return true;
            if (categoria === "Libros" && (proyecto.category === "Cómics & manga" || proyecto.category === "Libros")) return true;
            return false;
        });
    }

    proyectosFiltrados.forEach(proyecto => {
        let redirectUrl;

        // Excepción para el proyecto NitroPress
        if (proyecto.title === "Máquinas NitroPress" && proyecto.redirect) {
            redirectUrl = proyecto.redirect;
        } else {
            redirectUrl = `/campañas/tCampaña.html?id=${encodeURIComponent(proyecto.title || proyecto.titulo)}`;
        }

        // Verifica el valor de funded y goal
        console.log(`Proyecto: ${proyecto.title}, Funded: ${proyecto.funded}, Goal: ${proyecto.goal}`);

        // Lógica para determinar el estado del proyecto
        let estado;
        if (proyecto.terminada) {
            estado = "Terminado";
        } else {
            const porcentajeFinanciado = (proyecto.funded / proyecto.goal) * 100;
            estado = porcentajeFinanciado >= 50 ? "Activo" : "Activo";
        }

        // Determinar el color del estado
        let colorEstado;
        switch (estado) {
            case "Terminado":
                colorEstado = "red";
                break;
            case "Activo":
                colorEstado = "green";
                break;
            case "Inactivo":
                colorEstado = "green";
                break;
        }

        contenedor.innerHTML += `
            <div class="producto">
                <a href="${redirectUrl}" style="text-decoration: none; color: black;">
                    <img src="${proyecto.image || proyecto.imagen}" alt="${proyecto.title || proyecto.titulo}" class="producto-imagen">
                    <div class="producto-detalles">
                        <div class="producto-titulo">${proyecto.title || proyecto.titulo}</div>
                        <div class="producto-creator">${proyecto.creator}</div>
                        <div class="producto-financiado" style="color: ${colorEstado};">${estado}</div>
                    </div>
                </a>
            </div>
        `;
    });
}

// Actualiza los botones de categoría
function actualizarBotones(categoriaSeleccionada) {
    const botonesCategorias = document.querySelectorAll('.boton-categoria');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', () => {
            // Elimina la clase 'active' de todos los botones
            botonesCategorias.forEach(btn => btn.classList.remove('active'));

            // Añade la clase 'active' al botón que se clickeó
            boton.classList.add('active');

            // Actualiza el título principal
            const titulo = boton.textContent.trim();
            document.getElementById('titulo-principal').textContent = titulo;
        });
    });
}

// Maneja la selección de categoría
async function manejarCambioCategoria(categoria) {
    currentCategory = categoria;
    await filtrarProyectos(categoria);
    actualizarBotones(categoria);
}

// Inicializa la página con la categoría "Todos"
document.addEventListener('DOMContentLoaded', async () => {
    await manejarCambioCategoria("Todos"); // Muestra todos los productos al cargar la página

    document.getElementById('todos').addEventListener('click', () => manejarCambioCategoria("Todos"));
    document.getElementById('Tecnologia').addEventListener('click', () => manejarCambioCategoria("Tecnología"));
    document.getElementById('Libros').addEventListener('click', () => manejarCambioCategoria("Libros"));
    document.getElementById('Juegos').addEventListener('click', () => manejarCambioCategoria("Juegos"));
});

// Función para mostrar todo el contenido de localStorage (para depuración)
function mostrarLocalStorage() {
    console.log("Contenido completo de localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key, ":", localStorage.getItem(key));
    }
}

// Llamar a la función para mostrar localStorage al cargar la página
mostrarLocalStorage();