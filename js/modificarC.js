// Obtener el ID de la campaña de la URL
const urlParams = new URLSearchParams(window.location.search);
const campaignId = urlParams.get('id'); // Ahora será "source-index"

// Parsear el ID para obtener la fuente y el índice
const [source, index] = campaignId.split('-');
const numericIndex = parseInt(index);

// Obtener todas las campañas guardadas en sessionStorage
const todasLasCampanas = JSON.parse(sessionStorage.getItem('todasLasCampanas'));
let campana = todasLasCampanas[numericIndex];

if (!campana) {
    alert('Campaña no encontrada');
    window.location.href = 'index.html';
}

// Funciones para mostrar/ocultar secciones
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(seccion => seccion.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

async function actualizarCampana() {
    if (source === 'json') {
        try {
            const campanasJSON = todasLasCampanas.filter(c => c.source === 'json');
            const response = await fetch('js/campañas.json', {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'update', data: campanasJSON }) // Enviar acción y datos
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar el archivo JSON: ${response.status} ${response.statusText} - ${errorText}`);
            }
        } catch (error) {
            console.error("Error al actualizar el JSON:", error);
            alert(`Error al actualizar la campaña en el JSON: ${error.message}`);
            return;
        }
    } else {
        const campanasLocal = todasLasCampanas.filter(c => c.source === 'local');
        localStorage.setItem('campañas', JSON.stringify(campanasLocal));
    }

    todasLasCampanas[numericIndex] = campana;
    sessionStorage.setItem('todasLasCampanas', JSON.stringify(todasLasCampanas));
}

// Event listeners para los botones del menú
document.getElementById('btnNombre').addEventListener('click', () => mostrarSeccion('seccionNombre'));
document.getElementById('btnDescripcion').addEventListener('click', () => mostrarSeccion('seccionDescripcion'));
document.getElementById('btnMeta').addEventListener('click', () => mostrarSeccion('seccionMeta'));
document.getElementById('btnHistorial').addEventListener('click', () => {
    mostrarSeccion('seccionHistorial');
    mostrarHistorialDonaciones();
});
document.getElementById('btnTerminar').addEventListener('click', () => mostrarSeccion('seccionTerminar'));
document.getElementById('btnEliminar').addEventListener('click', () => mostrarSeccion('seccionEliminar'));

// Manejar cambio de nombre
document.getElementById('formNombre').addEventListener('submit', async (e) => {
    e.preventDefault();
    campana.title = document.getElementById('nuevoNombre').value;
    await actualizarCampana();
    alert('Nombre actualizado con éxito');
});

// Manejar cambio de descripción
document.getElementById('formDescripcion').addEventListener('submit', async (e) => {
    e.preventDefault();
    campana.descripcion = document.getElementById('nuevaDescripcion').value;
    await actualizarCampana();
    alert('Descripción actualizada con éxito');
});

// Manejar cambio de meta
document.getElementById('formMeta').addEventListener('submit', async (e) => {
    e.preventDefault();
    campana.meta = parseFloat(document.getElementById('nuevaMeta').value);
    await actualizarCampana();
    alert('Meta actualizada con éxito');
});

// Mostrar historial de donaciones
function mostrarHistorialDonaciones() {
    const historialContainer = document.getElementById('historialDonaciones');
    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));

    if (!usuarioActual) {
        historialContainer.innerHTML = '<p class="no-donations">No se ha iniciado sesión.</p>';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.id === usuarioActual.id);

    if (!usuario || !usuario.historialDonaciones || usuario.historialDonaciones.length === 0) {
        historialContainer.innerHTML = '<p class="no-donations">No hay donaciones registradas.</p>';
        return;
    }

    let tabla = `
        <table>
            <tr>
                <th>Fecha</th>
                <th>Proyecto</th>
                <th>Monto</th>
                <th>Método de Pago</th>
                <th>Donante</th>
            </tr>
    `;

    usuario.historialDonaciones.forEach(donacion => {
        tabla += `
            <tr>
                <td>${new Date(donacion.fecha).toLocaleString()}</td>
                <td>${donacion.proyecto}</td>
                <td>${donacion.monto} CLP</td>
                <td>${donacion.metodoPago}</td>
                <td>${donacion.nombreDonante || 'Anónimo'}</td>
            </tr>
        `;
    });

    tabla += '</table>';
    historialContainer.innerHTML = tabla;
}

// Manejar terminar campaña
document.getElementById('formTerminar').addEventListener('submit', async (e) => {
    e.preventDefault();
    campana.terminada = true;
    await actualizarCampana();
    alert('Campaña terminada con éxito');
    window.location.href = 'index.html';
});

// Manejar eliminar campaña
document.getElementById('formEliminar').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (confirm('¿Estás seguro de que quieres eliminar esta campaña? Esta acción no se puede deshacer.')) {
        if (source === 'json') {
            try {
                // Eliminar del JSON
                const campanasJSON = todasLasCampanas.filter(c => c.source === 'json');
                campanasJSON.splice(numericIndex, 1);
                await fetch('data/campanas.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(campanasJSON)
                });
            } catch (error) {
                console.error("Error al eliminar del JSON:", error);
                alert('Error al eliminar la campaña del JSON');
                return;
            }
        } else {
            // Eliminar del localStorage
            const campanasLocal = todasLasCampanas.filter(c => c.source === 'local');
            campanasLocal.splice(numericIndex - todasLasCampanas.filter(c => c.source === 'json').length, 1);
            localStorage.setItem('campañas', JSON.stringify(campanasLocal));
        }
        alert('Campaña eliminada con éxito');
        window.location.href = 'index.html';
    }
});

// Manejar retiro de fondos
document.getElementById('btnRetirar').addEventListener('click', () => {
    mostrarSeccion('seccionRetirar');
});

document.getElementById('formRetirar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const tipoTarjeta = document.getElementById('tipoTarjeta').value;

    if (confirm(`¿Estás seguro de que quieres retirar los fondos a la tarjeta ${tipoTarjeta} con número ${numeroTarjeta}? Esto reseteará el monto financiado a cero.`)) {
        campana.funded = 0;
        await actualizarCampana();
        alert(`Fondos retirados con éxito a la tarjeta ${tipoTarjeta}. Monto financiado reiniciado a 0.`);
        window.location.href = 'index.html';
    }
});

// Cargar datos existentes en los formularios
document.getElementById('nuevoNombre').value = campana.title;
document.getElementById('nuevaDescripcion').value = campana.descripcion;
document.getElementById('nuevaMeta').value = campana.meta;

// Mostrar la sección de nombre por defecto
mostrarSeccion('seccionNombre');