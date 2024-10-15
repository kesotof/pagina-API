document.addEventListener('DOMContentLoaded', function() {
    console.log("Página de visualización cargada");
    mostrarCampanas();
    mostrarLocalStorage(); // Para depuración
});

function mostrarCampanas() {
    const campanasContainer = document.getElementById('campanas-container');
    let campanas = [];
    
    try {
        const campanasString = localStorage.getItem('campañas');
        console.log("Campañas string recuperado del localStorage:", campanasString);
        
        if (campanasString) {
            campanas = JSON.parse(campanasString);
        } else {
            console.log("No se encontraron campañas en localStorage");
        }
    } catch (error) {
        console.error("Error al parsear campañas:", error);
    }
    
    console.log("Campañas recuperadas del localStorage:", campanas);
    
    if (!Array.isArray(campanas) || campanas.length === 0) {
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
            <h2>${campana.title}</h2>
            <p>Creador: ${campana.creator}</p>
            <p>Categoría: ${campana.category}</p>
            <p>Descripción: ${campana.descripcion}</p>
            <p>Meta: $${campana.precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
            <p>Financiado: $${(campana.precio * campana.funded / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} (${campana.funded}%)</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${campana.funded}%"></div>
            </div>
        `;
        campanasContainer.appendChild(campanaElement);
    });
    console.log("Todas las campañas han sido renderizadas");
}

function mostrarLocalStorage() {
    console.log("Contenido completo de localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key, ":", localStorage.getItem(key));
    }
}

// Llamar a la función al cargar la página
mostrarLocalStorage();
