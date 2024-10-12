document.addEventListener('DOMContentLoaded', function() {
    console.log("Página de visualización cargada");
    console.log("Contenido actual de localStorage:", localStorage.getItem("campañas"));
    mostrarCampanas();
});

function mostrarCampanas() {
    const campanasContainer = document.getElementById('campanas-container');
    let campanas = [];
    try {
        const campanasString = localStorage.getItem('campañas');
        console.log("Campañas string recuperado del localStorage:", campanasString);
        campanas = JSON.parse(campanasString) || [];
    } catch (error) {
        console.error("Error al parsear campañas:", error);
        campanas = [];
    }
    console.log("Campañas recuperadas del localStorage:", campanas);

    if (campanas.length === 0) {
        console.log("No hay campañas para mostrar");
        campanasContainer.innerHTML = '<p>No hay campañas creadas aún.</p>';
        return;
    }

    campanasContainer.innerHTML = '';
    campanas.forEach(campana => {
        console.log("Renderizando campaña:", campana);
        const campanaElement = document.createElement('div');
        campanaElement.className = 'campana';
        campanaElement.innerHTML = `
            <img src="${campana.image}" alt="${campana.title}">
            <h2>${campana.title}</h2>
            <p>Creador: ${campana.creator}</p>
            <p>Categoría: ${campana.category}</p>
            <p>Descripción: ${campana.descripcion}</p>
            <p>Meta: $${campana.precio.toFixed(2)}</p>
            <p>Financiado: $${(campana.precio * campana.funded / 100).toFixed(2)} (${campana.funded}%)</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${campana.funded}%"></div>
            </div>
        `;
        campanasContainer.appendChild(campanaElement);
    });
    console.log("Todas las campañas han sido renderizadas");
}

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