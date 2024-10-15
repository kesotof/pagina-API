// Función para mostrar todas las campañas
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

    campanasContainer.innerHTML = '';

    if (!Array.isArray(campanas) || campanas.length === 0) {
        console.log("No hay campañas para mostrar");
        campanasContainer.innerHTML = '<p>No hay campañas creadas aún.</p>';
        return;
    }

    campanas.forEach((campana, index) => {
        const campanaElement = document.createElement('div');
        campanaElement.className = 'campana';
        campanaElement.innerHTML = `
            <img src="${campana.image}" alt="${campana.title}">
            <h2>${campana.title}</h2>
            <p>Creador: ${campana.creator}</p>
            <p>Categoría: ${campana.category}</p>
            <p>Descripción: ${campana.descripcion}</p>
            <p>Meta: $${campana.meta.toLocaleString()}</p>
            <p>Financiado: $${campana.funded.toLocaleString()} (${((campana.funded / campana.meta) * 100).toFixed(2)}%)</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${(campana.funded / campana.meta) * 100}%"></div>
            </div>
            <div class="campana-buttons">
                <button onclick="modificarCampana(${index})">Modificar</button>
            </div>
        `;
        campanasContainer.appendChild(campanaElement);
    });
}

function modificarCampana(index) {
    // Redirigir a una nueva página para modificar la campaña
    window.location.href = `modificarC.html?id=${index}`;
}


mostrarCampanas();