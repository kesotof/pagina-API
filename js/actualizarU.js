document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editProfileForm');
    const nombreInput = document.getElementById('nombre');
    const imagenInput = document.getElementById('imagenPerfil');
    const previewImagen = document.getElementById('previewImagen');
    
    // Cargar datos del usuario actual
    const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
    if (usuarioActual) {
        nombreInput.value = usuarioActual.nombre;
        // Si el usuario tiene una imagen de perfil guardada, mostrarla aquí
        if (usuarioActual.imagenPerfil) {
            previewImagen.src = usuarioActual.imagenPerfil;
            previewImagen.style.display = 'block';
        }
    }

    // Previsualizar la imagen seleccionada
    imagenInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImagen.src = e.target.result;
                previewImagen.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const passwordActual = document.getElementById('passwordActual').value;
        const nuevaPassword = document.getElementById('nuevaPassword').value;
        const confirmarPassword = document.getElementById('confirmarPassword').value;

        // Verificar la contraseña actual
        if (passwordActual !== usuarioActual.password) {
            alert('La contraseña actual es incorrecta.');
            return;
        }

        // Verificar si las nuevas contraseñas coinciden
        if (nuevaPassword !== confirmarPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }

        // Actualizar el nombre
        usuarioActual.nombre = nombreInput.value;

        // Actualizar la contraseña si se proporcionó una nueva
        if (nuevaPassword) {
            usuarioActual.password = nuevaPassword;
        }

        // Actualizar la imagen de perfil si se seleccionó una nueva
        if (imagenInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                usuarioActual.imagenPerfil = e.target.result;
                actualizarUsuario(usuarioActual);
            };
            reader.readAsDataURL(imagenInput.files[0]);
        } else {
            actualizarUsuario(usuarioActual);
        }
    });

    function actualizarPerfil(event) {
        event.preventDefault();
        
        const usuarioActual = JSON.parse(localStorage.getItem('usuario-sesion'));
        const nombreInput = document.getElementById('nombre');
        const imagenInput = document.getElementById('imagenPerfil');
        const passwordActual = document.getElementById('passwordActual').value;
        const nuevaPassword = document.getElementById('nuevaPassword').value;
        const confirmarPassword = document.getElementById('confirmarPassword').value;
    
        // Verificar la contraseña actual
        if (passwordActual !== usuarioActual.password) {
            alert('La contraseña actual es incorrecta.');
            return;
        }
    
        // Verificar si las nuevas contraseñas coinciden
        if (nuevaPassword !== confirmarPassword) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }
    
        // Actualizar el nombre
        usuarioActual.nombre = nombreInput.value;
    
        // Actualizar la contraseña si se proporcionó una nueva
        if (nuevaPassword) {
            usuarioActual.password = nuevaPassword;
        }
    
        // Actualizar la imagen de perfil si se seleccionó una nueva
        if (imagenInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                usuarioActual.imagenPerfil = e.target.result;
                actualizarUsuario(usuarioActual);
            };
            reader.readAsDataURL(imagenInput.files[0]);
        } else {
            // Si no se seleccionó una nueva imagen, asegúrate de que haya una imagen predeterminada
            if (!usuarioActual.imagenPerfil) {
                usuarioActual.imagenPerfil = DEFAULT_PROFILE_IMAGE;
            }
            actualizarUsuario(usuarioActual);
        }
    }
});