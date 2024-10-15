// Función para cargar todos los proyectos
async function getAllCampaigns() {
    const proyectosInicialesActualizados = JSON.parse(localStorage.getItem('proyectosIniciales')) || [
        { title: "Máquinas NitroPress", creator: "NitroPress®", image: "/image/proyectosD/nitro.jpg", funded: 60000, category: "Tecnología", descripcion: "Descripción de NitroPress", meta: 100000 },
        { title: "Rayman® The Board Game", creator: "Flyos Games", image: "/image/proyectosD/rayman.jpg", funded: 21500, category: "Juegos", descripcion: "Descripción de Rayman", meta: 50000 },
        { title: "Lezo", creator: "lezocomic", image: "/image/proyectosD/lezo.jpg", funded: 9900, category: "Cómics & manga", descripcion: "Descripción de Lezo", meta: 30000 },
        { title: "Solar Card", creator: "Solarballs", image: "/image/proyectosD/solar.jpg", funded: 5400, category: "Tecnología", descripcion: "Descripción de Solar Card", meta: 20000 },
        { title: "Disk Plus", creator: "Sharge Tech", image: "/image/proyectosD/disk.jpg", funded: 9600, category: "Tecnología", descripcion: "Descripción de Disk Plus", meta: 40000 },
        { title: "Papadum y la tarta", creator: "Mike Bonales", image: "/image/proyectosD/papadum.jpg", funded: 31500, category: "Cómics & manga", descripcion: "Descripción de Papadum y la tarta", meta: 150000 },
        { title: "Twisted Cryptids", creator: "Ramy Badie", image: "/image/proyectosD/twisted.jpg", funded: 21600, category: "Juegos", descripcion: "Descripción de Twisted Cryptids", meta: 120000 },
        { title: "Lymow One", creator: "Lymow Tech", image: "/image/proyectosD/robot.jpg", funded: 3750, category: "Tecnología", descripcion: "Descripción de Lymow One", meta: 25000 }
    ];
    const jsonCampaigns = await cargarCampanasJSON();
    const proyectosJSONActualizados = JSON.parse(localStorage.getItem('proyectosJSON')) || jsonCampaigns;
    const localCampaigns = JSON.parse(localStorage.getItem('campañas')) || [];

    return { proyectosIniciales: proyectosInicialesActualizados, jsonCampaigns: proyectosJSONActualizados, localCampaigns };
}

// Función para cargar campañas desde JSON
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

// Función para actualizar una campaña con una donación
async function actualizarCampaña(projectId, montoDonacion) {
    const { proyectosIniciales, jsonCampaigns, localCampaigns } = await getAllCampaigns();
    let campaña;
    let esProyectoInicial = false;
    let esProyectoJSON = false;

    // Buscar en proyectos iniciales
    campaña = proyectosIniciales.find(c => c.title === decodeURIComponent(projectId));
    if (campaña) {
        esProyectoInicial = true;
    }

    // Si no se encuentra, buscar en JSON
    if (!campaña) {
        campaña = jsonCampaigns.find(c => c.title === decodeURIComponent(projectId) || c.titulo === decodeURIComponent(projectId));
        if (campaña) {
            esProyectoJSON = true;
        }
    }

    // Si no se encuentra, buscar en proyectos locales
    if (!campaña) {
        campaña = localCampaigns.find(c => c.title === decodeURIComponent(projectId) || c.titulo === decodeURIComponent(projectId));
    }

    if (campaña) {
        let financiadoActual = parseFloat(campaña.funded) || 0;
        let metaCampaña = parseFloat(campaña.meta) || 1; // Evitar división por cero

        // Actualizar el monto financiado
        financiadoActual += montoDonacion;
        campaña.funded = financiadoActual;

        // Calcular el nuevo porcentaje
        let nuevoPercentaje = (financiadoActual / metaCampaña * 100).toFixed(2);
        campaña.percentageFunded = nuevoPercentaje;

        if (esProyectoInicial) {
            // Actualizar en localStorage para proyectos iniciales
            let proyectosInicialesActualizados = JSON.parse(localStorage.getItem('proyectosIniciales')) || proyectosIniciales;
            let index = proyectosInicialesActualizados.findIndex(c => c.title === campaña.title);
            if (index !== -1) {
                proyectosInicialesActualizados[index] = campaña;
            }
            localStorage.setItem('proyectosIniciales', JSON.stringify(proyectosInicialesActualizados));
        } else if (esProyectoJSON) {
            // Actualizar en localStorage para proyectos JSON
            let proyectosJSONActualizados = JSON.parse(localStorage.getItem('proyectosJSON')) || jsonCampaigns;
            let index = proyectosJSONActualizados.findIndex(c => c.title === campaña.title || c.titulo === campaña.titulo);
            if (index !== -1) {
                proyectosJSONActualizados[index] = campaña;
            } else {
                proyectosJSONActualizados.push(campaña);
            }
            localStorage.setItem('proyectosJSON', JSON.stringify(proyectosJSONActualizados));
        } else {
            // Actualizar en localStorage para otros proyectos
            let index = localCampaigns.findIndex(c => c.title === campaña.title || c.titulo === campaña.titulo);
            if (index !== -1) {
                localCampaigns[index] = campaña;
            } else {
                localCampaigns.push(campaña);
            }
            localStorage.setItem('campañas', JSON.stringify(localCampaigns));
        }
    }
}

// Función para procesar la donación
function procesarDonacion(event) {
    event.preventDefault();
    const nombre = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const monto = parseFloat(document.getElementById('amount').value);
    const metodoPago = document.getElementById('paymentMethod').value;

    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido para la donación.');
        return;
    }

    console.log(`Donación de ${monto} CLP recibida de ${nombre} (${email}) mediante ${metodoPago}`);

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    actualizarCampaña(projectId, monto);

    alert('¡Gracias por tu donación!');
    window.location.href = `/index.html?id=${encodeURIComponent(projectId)}`;
}

// Cargar detalles de la campaña en la página del carrito
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
        const { proyectosIniciales, jsonCampaigns, localCampaigns } = await getAllCampaigns();
        const allCampaigns = [...proyectosIniciales, ...jsonCampaigns, ...localCampaigns];
        const project = allCampaigns.find(c => c.title === decodeURIComponent(projectId) || c.titulo === decodeURIComponent(projectId));
        
        if (project) {
            document.getElementById('campaignTitle').textContent = project.title || project.titulo;
            // Puedes agregar más detalles del proyecto aquí si es necesario
        } else {
            document.body.innerHTML = '<h1>Error: Proyecto no encontrado</h1>';
        }
    } else {
        document.body.innerHTML = '<h1>Error: No se especificó ningún proyecto</h1>';
    }

    // Agregar el event listener para el formulario de donación
    document.getElementById('donationForm').addEventListener('submit', procesarDonacion);
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
document.addEventListener('DOMContentLoaded', mostrarLocalStorage);

// Función para guardar la donación en el historial del usuario
function guardarDonacionEnHistorial(userId, monto, proyecto, metodoPago, nombreDonante) {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));

    const donacion = {
        fecha: new Date().toISOString(),
        proyecto: proyecto,
        monto: monto,
        metodoPago: metodoPago,
        nombreDonante: nombreDonante, // Aquí debe capturarse correctamente
    };

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let usuario = usuarios.find(u => u.id === userId);
    
    if (usuario) {
        if (!usuario.historialDonaciones) {
            usuario.historialDonaciones = [];
        }
        usuario.historialDonaciones.push(donacion);
        
        let index = usuarios.findIndex(u => u.id === userId);
        usuarios[index] = usuario;
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Función modificada para procesar la donación
function procesarDonacion(event) {
    event.preventDefault();
    const nombre = document.getElementById('name').value; // Asegúrate de que este ID sea correcto
    const email = document.getElementById('email').value;
    const monto = parseFloat(document.getElementById('amount').value);
    const metodoPago = document.getElementById('paymentMethod').value;

    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido para la donación.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    actualizarCampaña(projectId, monto);

    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
    if (usuarioActual) {
        const donacion = {
            fecha: new Date().toISOString(),
            monto: monto,
            proyecto: projectId,
            metodoPago: metodoPago
        };
        guardarDonacionEnHistorial(usuarioActual.id, monto, projectId, metodoPago, nombre); // Asegúrate de que el nombre se esté pasando aquí
    }

    alert('¡Gracias por tu donación!');
    window.location.href = `/index.html?id=${encodeURIComponent(projectId)}`;
}