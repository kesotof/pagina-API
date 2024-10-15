document.addEventListener('DOMContentLoaded', function() {
    mostrarHistorialDonaciones();
});

function mostrarHistorialDonaciones() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
    if (!usuarioActual) {
        document.getElementById('historial').innerHTML = '<p class="no-donations">No se ha iniciado sesión.</p>';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.id === usuarioActual.id);

    if (!usuario || !usuario.historialDonaciones || usuario.historialDonaciones.length === 0) {
        document.getElementById('historial').innerHTML = '<p class="no-donations">No hay donaciones registradas.</p>';
        return;
    }

    let tabla = `
        <table>
            <tr>
                <th>Fecha</th>
                <th>Proyecto</th>
                <th>Monto</th>
                <th>Método de Pago</th>
            </tr>
    `;

    usuario.historialDonaciones.forEach(donacion => {
        tabla += `
            <tr>
                <td>${new Date(donacion.fecha).toLocaleString()}</td>
                <td>${donacion.proyecto}</td>
                <td>${donacion.monto} CLP</td>
                <td>${donacion.metodoPago}</td>
            </tr>
        `;
    });

    tabla += '</table>';
    document.getElementById('historial').innerHTML = tabla;
}