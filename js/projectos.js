const proyectosIniciales = [
    { redirect: "/campañas/nitroPreess.html", title: "Máquinas NitroPress", creator: "NitroPress®", image: "/image/proyectosD/nitro.jpg", funded: 60, category: "Tecnología" },
    { redirect: "", title: "Rayman® The Board Game", creator: "Flyos Games", image: "/image/proyectosD/rayman.jpg", funded: 43, category: "Juegos" },
    { redirect: "", title: "Lezo", creator: "lezocomic", image: "/image/proyectosD/lezo.jpg", funded: 33, category: "Cómics & manga" },
    { redirect: "", title: "Solar Card", creator: "Solarballs", image: "/image/proyectosD/solar.jpg", funded: 27, category: "Tecnología" },
    { redirect: "", title: "Disk Plus", creator: "Sharge Tech", image: "/image/proyectosD/disk.jpg", funded: 24, category: "Tecnología" },
    { redirect: "", title: "Papadum y la tarta", creator: "Mike Bonales", image: "/image/proyectosD/papadum.jpg", funded: 21, category: "Cómics & manga" },
    { redirect: "", title: "Twisted Cryptids", creator: "Ramy Badie", image: "/image/proyectosD/twisted.jpg", funded: 18, category: "Juegos" },
    { redirect: "", title: "Lymow One", creator: "Lymow Tech", image: "/image/proyectosD/robot.jpg", funded: 15, category: "Tecnología" },
];

let currentPage = 0;
const projectsPerPage = 8;
let currentCategory = "Populares";

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

function cargarCampanasLocal() {
    return JSON.parse(localStorage.getItem("campañas")) || [];
}

async function cargarProyectos() {
    const campañasJSON = await cargarCampanasJSON();
    const campañasLocal = cargarCampanasLocal();
    const todasLasCampanas = [...campañasJSON, ...campañasLocal];
    return [...proyectosIniciales, ...todasLasCampanas];
}

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
        let redirectUrl;
        
        // Verificar si el proyecto está en proyectosIniciales
        const esProyectoInicial = proyectosIniciales.some(p => p.title === proyecto.title);
        
        if (esProyectoInicial) {
            // Si es un proyecto inicial, usar su redirect original
            redirectUrl = proyecto.redirect || '#'; // '#' como fallback si redirect está vacío
        } else {
            // Si no es un proyecto inicial, es un proyecto nuevo y usamos tCampaña.html
            redirectUrl = `/campañas/tCampaña.html?id=${encodeURIComponent(proyecto.title || proyecto.titulo)}`;
        }

        container.innerHTML += `
            <div class="projecto">
            <a href="${redirectUrl}"  style="text-decoration: none;color:black">
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

function navigate(direction) {
    const maxPage = Math.ceil((proyectosIniciales.length + cargarCampanasLocal().length) / projectsPerPage) - 1;
    currentPage += direction;
    if (currentPage < 0) currentPage = maxPage;
    if (currentPage > maxPage) currentPage = 0;
    renderProyectos();
}

function setCategory(category) {
    currentCategory = category;
    currentPage = 0;
    renderProyectos();
    updateCategoryButtons();
}

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