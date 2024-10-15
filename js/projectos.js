// Lista de proyectos iniciales
const proyectosIniciales = [
    { title: "Máquinas NitroPress", creator: "NitroPress®", image: "/image/proyectosD/nitro.jpg", funded: 60, category: "Tecnología", descripcion: "Descripción de NitroPress" },
    { title: "Rayman® The Board Game", creator: "Flyos Games", image: "/image/proyectosD/rayman.jpg", funded: 43, category: "Juegos", descripcion: "Descripción de Rayman" },
    { title: "Lezo", creator: "lezocomic", image: "/image/proyectosD/lezo.jpg", funded: 33, category: "Cómics & manga", descripcion: "Descripción de Lezo" },
    { title: "Solar Card", creator: "Solarballs", image: "/image/proyectosD/solar.jpg", funded: 27, category: "Tecnología", descripcion: "Descripción de Solar Card" },
    { title: "Disk Plus", creator: "Sharge Tech", image: "/image/proyectosD/disk.jpg", funded: 24, category: "Tecnología", descripcion: "Descripción de Disk Plus" },
    { title: "Papadum y la tarta", creator: "Mike Bonales", image: "/image/proyectosD/papadum.jpg", funded: 21, category: "Cómics & manga", descripcion: "Descripción de Papadum y la tarta" },
    { title: "Twisted Cryptids", creator: "Ramy Badie", image: "/image/proyectosD/twisted.jpg", funded: 18, category: "Juegos", descripcion: "Descripción de Twisted Cryptids" },
    { title: "Lymow One", creator: "Lymow Tech", image: "/image/proyectosD/robot.jpg", funded: 15, category: "Tecnología", descripcion: "Descripción de Lymow One" }
];

// Variables globales
let currentPage = 0;
const projectsPerPage = 8;
let currentCategory = "Populares";

// Función para cargar campañas desde el archivo JSON
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

// Función para cargar campañas desde localStorage
function cargarCampanasLocal() {
    return JSON.parse(localStorage.getItem("campañas")) || [];
}

// Función para cargar todos los proyectos
async function cargarProyectos() {
    const campañasJSON = await cargarCampanasJSON();
    const campañasLocal = cargarCampanasLocal();
    return [...proyectosIniciales, ...campañasJSON, ...campañasLocal];
}

// Función para renderizar los proyectos en la página
async function renderProyectos() {
    const proyectos = await cargarProyectos();
    const container = document.getElementById('projectosContainer');
    container.innerHTML = '';

    let filteredProyectos = proyectos;
    if (currentCategory !== "Populares") {
        filteredProyectos = proyectos.filter(proyecto => proyecto.category === currentCategory);
    }

    const startIndex = currentPage * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const visibleProyectos = filteredProyectos.slice(startIndex, endIndex);

    visibleProyectos.forEach(proyecto => {
        const redirectUrl = `/campañas/tCampaña.html?id=${encodeURIComponent(proyecto.title || proyecto.titulo)}`;

        container.innerHTML += `
            <div class="projecto">
                <a href="${redirectUrl}" style="text-decoration: none;color:black">
                    <img src="${proyecto.image || proyecto.imagen}" alt="${proyecto.title || proyecto.titulo}">
                    <div class="projecto-info">
                        <div class="projecto-creator">${proyecto.creator}</div>
                        <div class="projecto-title">${proyecto.title || proyecto.titulo}</div>
                        <div class="projecto-stats">
                            <span>${proyecto.funded}% Financiado</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
}

// Función para navegar entre páginas
function navigate(direction) {
    const maxPage = Math.ceil((proyectosIniciales.length + cargarCampanasLocal().length) / projectsPerPage) - 1;
    currentPage += direction;
    if (currentPage < 0) currentPage = maxPage;
    if (currentPage > maxPage) currentPage = 0;
    renderProyectos();
}

// Función para cambiar la categoría
function setCategory(category) {
    currentCategory = category;
    currentPage = 0;
    renderProyectos();
    updateCategoryButtons();
}

// Función para actualizar los botones de categoría
function updateCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.categorys');
    categoryButtons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent === currentCategory) {
            button.classList.add('active');
        }
    });
}

// Inicializar la visualización de proyectos y configurar los botones de categoría
document.addEventListener('DOMContentLoaded', () => {
    renderProyectos();
    const categoryButtons = document.querySelectorAll('.categorys');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => setCategory(button.textContent));
    });
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

