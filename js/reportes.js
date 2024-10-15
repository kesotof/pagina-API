function guardarDatosModal() {
    // Obtener los valores de los inputs por su id
    var razon = document.getElementById('recipient-name').value;
    var descripcion = document.getElementById('message-text').value;
  
    // Crear un objeto con la información
    var reporte = {
      razon: razon,
      descripcion: descripcion
    };
  
    // Guardar el objeto como string en localStorage
    localStorage.setItem('reporte', JSON.stringify(reporte));
  
    // Mostrar un mensaje de confirmación o feedback si es necesario
    alert('Reporte guardado correctamente');
  }