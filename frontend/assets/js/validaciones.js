const expresiones = { 
    nom_user: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/, // El nombre solo puede tener letras entre 2 y 50 caracteres
    num_ident: /^\d{6,14}$/, // Solo puede tener numeros entre 6 y 14 caracteres
    telefono: /^\d{10}$/, // teleono solo puede tener eatamente 10 digitos 
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // El correo solo puede tener el formato adecuado
    contrasena: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/ // la contraseña tiene que tener al menos 12 caractres, una minuscula, una mayuscula, un numero, y un simbolo especial
};

const mensajesError = { // Deja un mensaje de error si las validaciones no son correctas
    nom_user: {
        formato: 'El nombre solo puede contener letras y espacios',
    },
    num_ident: {
        formato: 'La identificacion debe contener solo numeros (6 a 14 digitos)',
    },
    telefono: {
        formato: 'El telefono debe tener exactamente 10 digitos'
    },
    email: {
        formato: 'El email debe tener un formato válido (ejemplo@dominio.com)',
        punto: 'El email debe contener al menos un punto (.) después del @'
    },
    contrasena: {
        longitud: 'La contraseña debe tener al menos 12 caracteres',
        formato: 'Debe incluir mayúscula, minúscula, número y símbolo'
    }
};

function validarFormulario() { // Se obtiene los valores de los campos del formulario
    const nom_user = document.getElementById('nom_user').value;
    const num_ident = document.getElementById('num_ident').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    // Limpiar errores
    document.getElementById('nom_userError').textContent = '';
    document.getElementById('num_identError').textContent = '';
    document.getElementById('telefonoError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('contrasenaError').textContent = '';

    let isValid = true; // Determina si esta valido el formuario 

    if (!expresiones.nom_user.test(nom_user)) {
        document.getElementById('nom_userError').textContent = mensajesError.nom_user.formato;
        isValid = false; // Si el valor no cumple con la expresion definida se mostrara el mensaje de error y se cambia isValid por false
    }

    if (!expresiones.num_ident.test(num_ident)) {
        document.getElementById('num_identError').textContent = mensajesError.num_ident.formato;
        isValid = false;
    }

    if (!expresiones.telefono.test(telefono)) {
        document.getElementById('telefonoError').textContent = mensajesError.telefono.formato;
        isValid = false;
    }

    if (!expresiones.email.test(email)) {
        document.getElementById('emailError').textContent = mensajesError.email.formato;
        isValid = false;
    } else {
        const afterAt = email.split('@')[1];
        if (!afterAt || !afterAt.includes('.')) {
            document.getElementById('emailError').textContent = mensajesError.email.punto;
            isValid = false;
        }
    }

    if (!expresiones.contrasena.test(contrasena)) {
        if (contrasena.length < 12) {
            document.getElementById('contrasenaError').textContent = mensajesError.contrasena.longitud;
        } else {
            document.getElementById('contrasenaError').textContent = mensajesError.contrasena.formato;
        }
        isValid = false;
    }

    return isValid; // Retorna si el formulario es valido o no
}

// Se añade un listener para que valide en tiempo real mientras el usuario escribe . Si el valor es valido el mensaje de error se limpia de lo contrario muestra el error correspondiente
document.getElementById('nom_user').addEventListener('input', function(e) {
    const valor = e.target.value;
    const mensaje = document.getElementById('nom_userError');
    mensaje.textContent = expresiones.nom_user.test(valor) ? '' : mensajesError.nom_user.formato;
});

document.getElementById('num_ident').addEventListener('input', function(e) {
    const valor = e.target.value.replace(/\D/g, '');
    e.target.value = valor;
    const mensaje = document.getElementById('num_identError');
    mensaje.textContent = expresiones.num_ident.test(valor) ? '' : mensajesError.num_ident.formato;
});

document.getElementById('telefono').addEventListener('input', function(e) {
    const valor = e.target.value.replace(/\D/g, '');
    e.target.value = valor;
    const mensaje = document.getElementById('telefonoError');
    mensaje.textContent = expresiones.telefono.test(valor) ? '' : mensajesError.telefono.formato;
});

document.getElementById('email').addEventListener('input', function(e) {
    const valor = e.target.value;
    const mensaje = document.getElementById('emailError');
    if (!expresiones.email.test(valor)) {
        mensaje.textContent = mensajesError.email.formato;
    } else {
        const afterAt = valor.split('@')[1];
        mensaje.textContent = (!afterAt || !afterAt.includes('.')) ? mensajesError.email.punto : '';
    }
});

document.getElementById('contrasena').addEventListener('input', function(e) {
    const valor = e.target.value;
    const mensaje = document.getElementById('contrasenaError');
    if (valor.length < 12) {
        mensaje.textContent = mensajesError.contrasena.longitud;
    } else if (!expresiones.contrasena.test(valor)) {
        mensaje.textContent = mensajesError.contrasena.formato;
    } else {
        mensaje.textContent = '';
    }
});
