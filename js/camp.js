let campañas = [];

// Cargar campañas desde el archivo JSON
fetch("./js/campañas.json")
    .then(response => response.json())
    .then(data => {
        campañas = data;
        cargarCampanasLocal(campañas); // Cargar las campañas desde el JSON
    });

const contenedorCampañas = document.querySelector("#contenedor-campañas");
let botonesAgregar = document.querySelectorAll(".campaña-agregar");
const numerito = document.querySelector("#numerito");

// Función para cargar las campañas tanto desde el JSON como desde el localStorage
function cargarCampañas(campañasElegidas) {
    contenedorCampañas.innerHTML = "";

    // Cargar campañas desde JSON
    campañasElegidas.forEach(campaña => {
        const div = document.createElement("div");
        div.classList.add("campaña");
        div.innerHTML = `
            <img class="campaña-imagen" src="${campaña.imagen}" alt="${campaña.titulo}">
            <div class="campaña-detalles">
                <h3 class="campaña-titulo">${campaña.titulo}</h3>
                <p class="campaña-descripcion">${campaña.descripcion}</p>
                <p class="campaña-categoria">${campaña.categoria}</p>
                <button class="campaña-agregar" id="${campaña.id}">Agregar</button>
            </div>
        `;

        contenedorCampañas.append(div);
    });

    // Cargar campañas desde el localStorage
    const campañasLocal = JSON.parse(localStorage.getItem("campañas")) || [];
    mostrarCampañasDesdeLocalStorage(campañasLocal);

    actualizarBotonesAgregar();
}

// Función para mostrar las campañas desde localStorage
function mostrarCampañasDesdeLocalStorage(campañas) {
    campañas.forEach(campaña => {
        const div = document.createElement("div");
        div.classList.add("campaña");
        div.innerHTML = `
            <img class="campaña-imagen" src="${campaña.imagen}" alt="${campaña.titulo}">
            <div class="campaña-detalles">
                <h3 class="campaña-titulo">${campaña.titulo}</h3>
                <p class="campaña-descripcion">${campaña.descripcion}</p>
                <p class="campaña-categoria">${campaña.categoria}</p>
                <button class="campaña-agregar" id="${campaña.id}">Agregar</button>
            </div>
        `;

        contenedorCampañas.append(div);
    });

    actualizarBotonesAgregar();
}

// Actualizar los botones para agregar campañas al carrito
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".campaña-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Lógica del carrito
let campañasEnCarrito = JSON.parse(localStorage.getItem("campañas-en-carrito")) || [];

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const campañaAgregada = campañas.find(campaña => campaña.id === idBoton);

    if (campañasEnCarrito.some(campaña => campaña.id === idBoton)) {
        const index = campañasEnCarrito.findIndex(campaña => campaña.id === idBoton);
        campañasEnCarrito[index].cantidad++;
    } else {
        campañaAgregada.cantidad = 1;
        campañasEnCarrito.push(campañaAgregada);
    }

    actualizarNumerito();
    localStorage.setItem("campañas-en-carrito", JSON.stringify(campañasEnCarrito));
}

// Actualizar el número del carrito
function actualizarNumerito() {
    const nuevoNumerito = campañasEnCarrito.reduce((acc, campaña) => acc + campaña.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

// Llamar a la función inicial para cargar las campañas
cargarCampañas(campañas);
