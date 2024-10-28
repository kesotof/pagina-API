const proyectosIniciales = [
    { title: "Máquinas NitroPress", creator: "NitroPress®", image: "/image/proyectosD/nitro.jpg", funded: 60, category: "Tecnología", descripcion: "Descripción de NitroPress", meta: 100000 }, // Ejemplo de meta
    { title: "Rayman® The Board Game", creator: "Flyos Games", image: "/image/proyectosD/rayman.jpg", funded: 43, category: "Juegos", descripcion: "Descripción de Rayman", meta: 50000 },
    { title: "Lezo", creator: "lezocomic", image: "/image/proyectosD/lezo.jpg", funded: 33, category: "Cómics & manga", descripcion: "Descripción de Lezo", meta: 30000 },
    { title: "Solar Card", creator: "Solarballs", image: "/image/proyectosD/solar.jpg", funded: 27, category: "Tecnología", descripcion: "Descripción de Solar Card", meta: 20000 },
    { title: "Disk Plus", creator: "Sharge Tech", image: "/image/proyectosD/disk.jpg", funded: 24, category: "Tecnología", descripcion: "Descripción de Disk Plus", meta: 40000 },
    { title: "Papadum y la tarta", creator: "Mike Bonales", image: "/image/proyectosD/papadum.jpg", funded: 21, category: "Cómics & manga", descripcion: "Descripción de Papadum y la tarta", meta: 150000 },
    { title: "Twisted Cryptids", creator: "Ramy Badie", image: "/image/proyectosD/twisted.jpg", funded: 18, category: "Juegos", descripcion: "Descripción de Twisted Cryptids", meta: 120000 },
    { title: "Lymow One", creator: "Lymow Tech", image: "/image/proyectosD/robot.jpg", funded: 15, category: "Tecnología", descripcion: "Descripción de Lymow One", meta: 25000 }
];

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    let debugInfo = `URL Params: ${window.location.search}\n`;
    debugInfo += `Project ID: ${projectId}\n\n`;

    if (projectId) {
        loadProjectDetails(projectId, debugInfo);
    } else {
        document.body.innerHTML = '<h1>Error: No se especificó ningún proyecto</h1>';
        document.getElementById('debug-info').textContent = debugInfo;
    }
});

// Función para iniciar sesión (proporcionada por el usuario)
function iniciarSesion(nombre, password) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const usuario = usuarios.find(user => user.nombre === nombre && user.password === password);

    if (usuario) {
        localStorage.setItem("usuario-sesion", JSON.stringify(usuario));
        console.log("Inicio de sesión exitoso");
        return true;
    } else {
        console.log("Nombre de usuario o contraseña incorrectos");
        return false;
    }
}

// Función para verificar si el usuario ha iniciado sesión
function usuarioHaIniciadoSesion() {
    return localStorage.getItem("usuario-sesion") !== null;
}

// Función para obtener el nombre del usuario actual
function obtenerNombreUsuario() {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario-sesion"));
    return usuarioSesion ? usuarioSesion.nombre : null;
}

// Funciones actualizadas para manejar comentarios
function loadComments() {
    const projectId = new URLSearchParams(window.location.search).get('id');
    const comments = JSON.parse(localStorage.getItem(`comments-${projectId}`)) || [];
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong>${comment.author}</strong> - ${new Date(comment.timestamp).toLocaleString()}
            </div>
            <div class="comment-content">${comment.text}
            <button onclick="deleteComment()">Eliminar</button>
            </div>
            
        `;
        commentsList.appendChild(commentElement);
    });

    // Cargar el formulario de comentarios o mensaje de inicio de sesión
    loadCommentForm();
}

function loadCommentForm() {
    const commentFormContainer = document.getElementById('comment-form-container');
    if (usuarioHaIniciadoSesion()) {
        commentFormContainer.innerHTML = `
            <div class="comment-form">
                <textarea id="comment-text" placeholder="Escribe tu comentario aquí"></textarea>
                <button onclick="addComment()">Enviar comentario</button>
            </div>


        `;
    } else {
        commentFormContainer.innerHTML = `
            <div class="login-message">
                Debes iniciar sesión para poder comentar.
            </div>
        `;
    }
}

function addComment() {
    const projectId = new URLSearchParams(window.location.search).get('id');
    const commentText = document.getElementById('comment-text').value.trim();
    const commenterName = obtenerNombreUsuario();
    if (commentText && commenterName) {
        const comments = JSON.parse(localStorage.getItem(`comments-${projectId}`)) || [];
        comments.push({
            author: commenterName,
            text: commentText,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(`comments-${projectId}`, JSON.stringify(comments));
        document.getElementById('comment-text').value = '';
        loadComments();
    }
}

function deleteComment() {
    const projectId = new URLSearchParams(window.location.search).get('id');
    const comments = JSON.parse(localStorage.getItem(`comments-${projectId}`)) || [];
    comments.pop();
    localStorage.setItem(`comments-${projectId}`, JSON.stringify(comments));
    loadComments();
}

async function loadProjectDetails(projectId, debugInfo) {
    const { proyectosIniciales, jsonCampaigns, localCampaigns } = await getAllCampaigns();
    const allCampaigns = [...proyectosIniciales, ...jsonCampaigns, ...localCampaigns];
    const project = allCampaigns.find(c => c.title === decodeURIComponent(projectId) || c.titulo === decodeURIComponent(projectId));

    debugInfo += `Proyecto buscado: ${decodeURIComponent(projectId)}\n`;
    debugInfo += `Proyecto encontrado: ${JSON.stringify(project, null, 2)}\n`;

    if (project) {
        document.getElementById('title').textContent = project.title || project.titulo;
        document.getElementById('image').src = project.image || project.imagen;
        document.getElementById('image').alt = project.title || project.titulo;
        document.getElementById('creator').textContent = project.creator;
        document.getElementById('category').textContent = project.category;
        document.getElementById('meta').textContent = new Intl.NumberFormat('es-CL').format(project.meta || 10000);
        const financiado = parseFloat(project.funded) || 0;
        document.getElementById('financiado').textContent = new Intl.NumberFormat('es-CL').format(financiado);
        const porcentaje = ((financiado / (project.meta || 10000)) * 100).toFixed(2);
        document.getElementById('porcentaje').textContent = porcentaje;
        document.getElementById('progress').style.width = `${porcentaje}%`;
        document.getElementById('description').textContent = project.descripcion || 'No hay descripción disponible.';
        loadComments();
    } else {
        document.body.innerHTML = '<h1>Error: Proyecto no encontrado</h1>';
    }

    document.getElementById('debug-info').textContent = debugInfo;
}

async function getAllCampaigns() {
    const proyectosInicialesActualizados = JSON.parse(localStorage.getItem('proyectosIniciales')) || proyectosIniciales;
    const jsonCampaigns = await cargarCampanasJSON();
    const proyectosJSONActualizados = JSON.parse(localStorage.getItem('proyectosJSON')) || jsonCampaigns;
    const localCampaigns = JSON.parse(localStorage.getItem('campañas')) || [];

    return { proyectosIniciales: proyectosInicialesActualizados, jsonCampaigns: proyectosJSONActualizados, localCampaigns };
}

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

function irACarrito() {
    const projectId = new URLSearchParams(window.location.search).get('id');
    window.location.href = `/Donar/carrito.html?id=${encodeURIComponent(projectId)}`;
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
