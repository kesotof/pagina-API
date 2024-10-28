async function mostrarCampanas() {
    const campanasContainer = document.getElementById('campanas-container');
    let campanas = [];
    let campanasJSON = [];

    try {
        // Cargar campañas del JSON
        const response = await fetch('js/campañas.json');
        campanasJSON = await response.json();
        console.log("Campañas recuperadas del JSON:", campanasJSON);

        // Cargar campañas del localStorage
        const campanasString = localStorage.getItem('campañas');
        console.log("Campañas string recuperado del localStorage:", campanasString);
        const campanasLocalStorage = campanasString ? JSON.parse(campanasString) : [];

        // Agregar una propiedad para identificar el origen
        campanasJSON = campanasJSON.map(c => ({ ...c, source: 'json' }));
        const campanasLocalMapped = campanasLocalStorage.map(c => ({ ...c, source: 'local' }));

        // Combinar ambas fuentes de campañas
        campanas = [...campanasJSON, ...campanasLocalMapped];
        console.log("Total de campañas combinadas:", campanas);

    } catch (error) {
        console.error("Error al cargar campañas:", error);
        // Si hay error al cargar el JSON, intentar usar solo las del localStorage
        const campanasString = localStorage.getItem('campañas');
        if (campanasString) {
            campanas = JSON.parse(campanasString).map(c => ({ ...c, source: 'local' }));
        }
    }

    campanasContainer.innerHTML = '';

    if (!Array.isArray(campanas) || campanas.length === 0) {
        console.log("No hay campañas para mostrar");
        campanasContainer.innerHTML = '<p>No hay campañas creadas aún.</p>';
        return;
    }

    campanas.forEach((campana, index) => {
        const campanaElement = document.createElement('div');
        campanaElement.className = 'campana';

        if (campana.terminada) {
            campanaElement.classList.add('campana-terminada');
        }

        // Crear un identificador único que incluya la fuente y el índice
        const campaignId = `${campana.source}-${index}`;

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
                <button onclick="modificarCampana('${campaignId}')" class="btn-modificar">
                    Modificar
                </button>
            </div>
        `;
        campanasContainer.appendChild(campanaElement);
            });

    // Guardar las campañas en sessionStorage para acceder a ellas en la página de modificación
    sessionStorage.setItem('todasLasCampanas', JSON.stringify(campanas));
}

function modificarCampana(campaignId) {
    // El campaignId ahora tiene el formato "source-index"
    window.location.href = `modificarC.html?id=${campaignId}`;
}

// Agregar estilos CSS necesarios
const styles = `
    .campana-terminada {
        opacity: 0.7;
        position: relative;
    }

    .campana-terminada::after {
        content: 'TERMINADA';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        font-weight: bold;
        font-size: 1.2em;
        z-index: 1;
    }

    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        margin-left: 10px;
    }

    .badge-json {
        background-color: #4CAF50;
        color: white;
    }

    .badge-local {
        background-color: #2196F3;
        color: white;
    }

    .btn-modificar:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

// Agregar los estilos al documento
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Iniciar la carga de campañas
mostrarCampanas();