// Obtener el ID de la campaña de la URL
const urlParams = new URLSearchParams(window.location.search);
const campanaId = parseInt(urlParams.get('id'));

// Cargar la campaña seleccionada
let campanas = JSON.parse(localStorage.getItem('campañas')) || [];
let campana = campanas[campanaId];

if (!campana) {
    alert('Campaña no encontrada');
    window.location.href = 'index.html';
}

// Funciones para mostrar/ocultar secciones
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(seccion => seccion.style.display = 'none');
    document.getElementById(id).style.display = 'block';
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

// Función para actualizar la campaña en localStorage
function actualizarCampana() {
    campanas[campanaId] = campana;
    localStorage.setItem('campañas', JSON.stringify(campanas));
}

// Manejar cambio de nombre
document.getElementById('formNombre').addEventListener('submit', (e) => {
    e.preventDefault();
    campana.title = document.getElementById('nuevoNombre').value;
    actualizarCampana();
    alert('Nombre actualizado con éxito');
});

// Manejar cambio de descripción
document.getElementById('formDescripcion').addEventListener('submit', (e) => {
    e.preventDefault();
    campana.descripcion = document.getElementById('nuevaDescripcion').value;
    actualizarCampana();
    alert('Descripción actualizada con éxito');
});

// Manejar cambio de meta
document.getElementById('formMeta').addEventListener('submit', (e) => {
    e.preventDefault();
    campana.meta = parseFloat(document.getElementById('nuevaMeta').value);
    actualizarCampana();
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
document.getElementById('formTerminar').addEventListener('submit', (e) => {
    e.preventDefault();
    campana.terminada = true; // Cambia el estado de la campaña a terminada
    actualizarCampana();
    alert('Campaña terminada con éxito');
    window.location.href = 'index.html';
});

// Manejar eliminar campaña
document.getElementById('formEliminar').addEventListener('submit', (e) => {
    e.preventDefault();
    if (confirm('¿Estás seguro de que quieres eliminar esta campaña? Esta acción no se puede deshacer.')) {
        campanas.splice(campanaId, 1);
        localStorage.setItem('campañas', JSON.stringify(campanas));
        alert('Campaña eliminada con éxito');
        window.location.href = 'index.html';
    }
});

// Cargar datos existentes en los formularios
document.getElementById('nuevoNombre').value = campana.title;
document.getElementById('nuevaDescripcion').value = campana.descripcion;
document.getElementById('nuevaMeta').value = campana.meta;

// Mostrar la sección de nombre por defecto
mostrarSeccion('seccionNombre');

// Event listener para el botón de Retirar Fondos
document.getElementById('btnRetirar').addEventListener('click', () => {
    mostrarSeccion('seccionRetirar'); // Mostrar la sección de retirar fondos
});

// Manejar el formulario de retiro de fondos
document.getElementById('formRetirar').addEventListener('submit', (e) => {
    e.preventDefault();
    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const tipoTarjeta = document.getElementById('tipoTarjeta').value;

    const confirmacion = confirm(`¿Estás seguro de que quieres retirar los fondos a la tarjeta ${tipoTarjeta} con número ${numeroTarjeta}? Esto reseteará el monto financiado a cero.`);
    
    if (confirmacion) {
        campana.funded = 0; // Reiniciar funded a 0
        actualizarCampana(); // Actualizar campaña en localStorage
        alert(`Fondos retirados con éxito a la tarjeta ${tipoTarjeta}. Monto financiado reiniciado a 0.`);
        window.location.href = 'index.html'; // Redirigir a la página principal
    }
});
