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
      
      // Crear botón para eliminar el reporte
      var btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.classList.add('btn', 'btn-danger', 'ml-2');
      btnEliminar.addEventListener('click', function() {
          localStorage.removeItem('reporte');
          listaReportes.removeChild(li);
          // Mostrar mensaje de que no hay reportes guardados
          listaReportes.innerHTML = '<li class="list-group-item">No hay reportes guardados</li>';
      });
      
      // Crear botón para modificar el reporte
      var btnModificar = document.createElement('button');
      btnModificar.textContent = 'Modificar';
      btnModificar.classList.add('btn', 'btn-primary', 'ml-2');
      btnModificar.addEventListener('click', function() {
          // Aquí puedes agregar la lógica para modificar el reporte
          var nuevaRazon = prompt("Nueva razón:", reporte.razon);
          var nuevaDescripcion = prompt("Nueva descripción:", reporte.descripcion);
          if (nuevaRazon !== null && nuevaDescripcion !== null) {
              reporte.razon = nuevaRazon;
              reporte.descripcion = nuevaDescripcion;
              localStorage.setItem('reporte', JSON.stringify(reporte));
              li.innerHTML = `<strong>Razón:</strong> ${reporte.razon} <br> <strong>Descripción:</strong> ${reporte.descripcion}`;
              li.appendChild(btnModificar);
              li.appendChild(btnEliminar);
          }
      });
      
      // Añadir los botones al li
      li.appendChild(btnModificar);
      li.appendChild(btnEliminar);
      
      // Añadir el reporte a la lista
      listaReportes.appendChild(li);
  } else {
      // Si no hay reportes, mostrar un mensaje
      listaReportes.innerHTML = '<li class="list-group-item">No hay reportes guardados</li>';
  }
});