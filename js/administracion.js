const proyectosIniciales = [
    { title: "Máquinas NitroPress", image: "/image/proyectosD/nitro.jpg" },
    { title: "Rayman® The Board Game", image: "/image/proyectosD/rayman.jpg" },
    { title: "Lezo", image: "/image/proyectosD/lezo.jpg" },
    { title: "Solar Card", image: "/image/proyectosD/solar.jpg" },
    { title: "Disk Plus", image: "/image/proyectosD/disk.jpg" },
    { title: "Papadum y la tarta", image: "/image/proyectosD/papadum.jpg" },
    { title: "Twisted Cryptids", image: "/image/proyectosD/twisted.jpg" },
    { title: "Lymow One", image: "/image/proyectosD/robot.jpg" }
];

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
    return [...proyectosIniciales, ...campañasJSON, ...campañasLocal];
}

function eliminarProyecto(title) {
    const index = proyectosIniciales.findIndex(proyecto => proyecto.title === title);
    if (index !== -1) {
        proyectosIniciales.splice(index, 1);
        renderProyectos();
    }
}

function editarProyecto(title) {
    const nuevoTitulo = prompt("Ingrese el nuevo título del proyecto:", title);
    if (nuevoTitulo) {
        const index = proyectosIniciales.findIndex(proyecto => proyecto.title === title);
        if (index !== -1) {
            proyectosIniciales[index].title = nuevoTitulo;
            renderProyectos();
        }
    }
}

function renderProyectos() {
    cargarProyectos().then(proyectos => {
        const container = document.getElementById('projectosContainer');
        container.innerHTML = '';

        proyectos.forEach(proyecto => {
            container.innerHTML += `
                <li>
                    <img src="${proyecto.image || proyecto.imagen}" alt="${proyecto.title || proyecto.titulo}" width="50">
                    ${proyecto.title || proyecto.titulo}
                    <button onclick="eliminarProyecto('${proyecto.title || proyecto.titulo}')">Eliminar</button>
                    <button onclick="editarProyecto('${proyecto.title || proyecto.titulo}')">Editar</button>
                </li>
            `;
        });
    });
}

function cargarUsuariosLocal() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

async function cargarUsuarios() {
    const usuariosLocal = cargarUsuariosLocal();
    return [...usuariosLocal];
}

function eliminarUsuario(nombre) {
    const usuariosLocal = cargarUsuariosLocal();
    const index = usuariosLocal.findIndex(usuario => usuario.nombre === nombre);
    if (index !== -1) {
        usuariosLocal.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuariosLocal));
        renderUsuarios();
    }
}

function editarUsuario(nombre) {
    const nuevoNombre = prompt("Ingrese el nuevo nombre del usuario:", nombre);
    if (nuevoNombre) {
        const usuariosLocal = cargarUsuariosLocal();
        const index = usuariosLocal.findIndex(usuario => usuario.nombre === nombre);
        if (index !== -1) {
            usuariosLocal[index].nombre = nuevoNombre;
            localStorage.setItem("usuarios", JSON.stringify(usuariosLocal));
            renderUsuarios();
        }
    }
}

function renderUsuarios() {
    cargarUsuarios().then(usuarios => {
        const container = document.getElementById('usuariosContainer');
        container.innerHTML = '';

        usuarios.forEach(usuario => {
            container.innerHTML += `
                <li>
                    ${usuario.nombre}
                    <button onclick="eliminarUsuario('${usuario.nombre}')">Eliminar</button>
                    <button onclick="editarUsuario('${usuario.nombre}')">Editar</button>
                </li>
            `;
        });
    });
}

function renderReportes() {
    const reportes = cargarReportes();
    const container = document.getElementById('lista-reportes');
    container.innerHTML = '';

    if (reportes.length > 0) {
        reportes.forEach((reporte, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `
                <strong>Razón:</strong> ${reporte.razon} <br> 
                <strong>Descripción:</strong> ${reporte.descripcion} <br>
                <button onclick="eliminarReporte(${index})">Eliminar</button>
                <button onclick="editarReporte(${index})">Editar</button>
            `;
            container.appendChild(li);
        });
    } else {
        container.innerHTML = '<li class="list-group-item">No hay reportes guardados</li>';
    }
}

function eliminarReporte(index) {
    const reportes = cargarReportes();
    reportes.splice(index, 1);
    localStorage.setItem('reportes', JSON.stringify(reportes));
    renderReportes();
}

function editarReporte(index) {
    const reportes = cargarReportes();
    const reporte = reportes[index];
    const nuevaRazon = prompt('Editar Razón:', reporte.razon);
    const nuevaDescripcion = prompt('Editar Descripción:', reporte.descripcion);

    if (nuevaRazon !== null && nuevaDescripcion !== null) {
        reportes[index] = { razon: nuevaRazon, descripcion: nuevaDescripcion };
        localStorage.setItem('reportes', JSON.stringify(reportes));
        renderReportes();
    }
}
// Función para eliminar una donación
function eliminarDonacion(index) {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
    if (!usuarioActual) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.id === usuarioActual.id);

    if (usuario && usuario.historialDonaciones) {
        usuario.historialDonaciones.splice(index, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarHistorialDonaciones();
    }
}


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
                    <th>Acciones</th>
                </tr>
        `;

        usuario.historialDonaciones.forEach((donacion, index) => {
            tabla += `
                <tr>
                    <td>${new Date(donacion.fecha).toLocaleString()}</td>
                    <td>${donacion.proyecto}</td>
                    <td>${donacion.monto} CLP</td>
                    <td>${donacion.metodoPago}</td>
                    <td>${donacion.nombreDonante || 'Anónimo'}</td>
                    <td><button onclick="eliminarDonacion(${index})">Eliminar</button></td>
                </tr>
            `;
        });

        tabla += '</table>';
        historialContainer.innerHTML = tabla;
    }

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(seccionId).style.display = 'block';

    // Renderizar proyectos solo si se muestra la sección de campañas
    if (seccionId === 'seccionCampanas') {
        renderProyectos();
    }

    // Renderizar usuarios solo si se muestra la sección de usuarios
    if (seccionId === 'seccionUsuarios') {
        renderUsuarios();
    }

    // Renderizar reportes solo si se muestra la sección de reportes
    if (seccionId === 'seccionReportes') {
        renderReportes();
    }

    // Mostrar historial de donaciones solo si se muestra la sección de donaciones
    if (seccionId === 'seccionDonaciones') {
        mostrarHistorialDonaciones();
    }
}

document.getElementById('btnDonaciones').addEventListener('click', () => {
    mostrarSeccion('seccionDonaciones');
});

document.getElementById('btnCampanas').addEventListener('click', () => {
    mostrarSeccion('seccionCampanas');
});

document.getElementById('btnUsuarios').addEventListener('click', () => {
    mostrarSeccion('seccionUsuarios');
});

document.getElementById('btnReportes').addEventListener('click', () => {
    mostrarSeccion('seccionReportes');
});

// Asegurarse de que las funciones estén disponibles en el ámbito global
window.eliminarProyecto = eliminarProyecto;
window.editarProyecto = editarProyecto;
window.eliminarUsuario = eliminarUsuario;
window.editarUsuario = editarUsuario;
window.cargarReportes = cargarReportes;
