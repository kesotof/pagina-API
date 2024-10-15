document.addEventListener("DOMContentLoaded", function() {
    // Obtener el ul donde se van a listar los reportes
    var listaReportes = document.getElementById('lista-reportes');
  
    // Obtener el reporte almacenado en localStorage
    var reporteGuardado = localStorage.getItem('reporte');
  
    // Verificar si hay reportes guardados
    if (reporteGuardado) {
      // Convertir el string JSON a un objeto
      var reporte = JSON.parse(reporteGuardado);
  
      // Crear un elemento li para mostrar el reporte
      var li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `<strong>Razón:</strong> ${reporte.razon} <br> <strong>Descripción:</strong> ${reporte.descripcion}`;
      
      // Añadir el reporte a la lista
      listaReportes.appendChild(li);
    } else {
      // Si no hay reportes, mostrar un mensaje
      listaReportes.innerHTML = '<li class="list-group-item">No hay reportes guardados</li>';
    }
  });