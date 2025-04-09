// Expresiones regulares para validaciones
// Estos son las expresiones regulares que estan estandarizadas para validar
const regex = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    ident: /^\d{6,14}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
};

// Mensajes de error
const mensajesError = {
    nombre: {
        formato: 'El nombre solo puede contener letras y espacios',
        longitud: 'El nombre debe tener entre 2 y 50 caracteres'
    },
    ident: {
        formato: 'Solo se permiten números',
        longitud: 'La identificación debe tener entre 6 y 14 dígitos'
    },
    email: {
        formato: 'El email debe tener un formato válido (ejemplo@dominio.com)',
        punto: 'El email debe contener al menos un punto (.) después del @'
    },
    password: {
        longitud: 'La contraseña debe tener al menos 6 caracteres',
        formato: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    }
};

function validarFormulario() {
    const nombre = document.getElementById('nombre').value;
    const ident = document.getElementById('ident').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    // Limpiar mensajes de error anteriores
    document.getElementById('nombreError').textContent = '';
    document.getElementById('identError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    let isValid = true;

    // Validación de nombre
    if (!regex.nombre.test(nombre)) {
        document.getElementById('nombreError').textContent = mensajesError.nombre.formato;
        isValid = false;
    }

    // Validación de identificación
    if (!regex.ident.test(ident)) {
        document.getElementById('identError').textContent = mensajesError.ident.longitud;
        isValid = false;
    }

    // Validación de email
    if (!regex.email.test(email)) {
        document.getElementById('emailError').textContent = mensajesError.email.formato;
        isValid = false;
    } else {
        const afterAt = email.split('@')[1];
        if (!afterAt || !afterAt.includes('.')) {
            document.getElementById('emailError').textContent = mensajesError.email.punto;
            isValid = false;
        }
    }

    // Validación de contraseña
    if (!regex.password.test(contrasena)) {
        document.getElementById('passwordError').textContent = mensajesError.password.formato;
        isValid = false;
    }

    return isValid;
}

// Validación en tiempo real para el campo de nombre
document.getElementById('nombre').addEventListener('input', function(e) {
    const nombre = e.target.value;
    const nombreError = document.getElementById('nombreError');
    
    if (!regex.nombre.test(nombre)) {
        nombreError.textContent = mensajesError.nombre.formato;
    } else {
        nombreError.textContent = '';
    }
});

// Validación en tiempo real para el campo de identificación
document.getElementById('ident').addEventListener('input', function(e) {
    const ident = e.target.value;
    const identError = document.getElementById('identError');
    
    if (!/^\d*$/.test(ident)) {
        identError.textContent = mensajesError.ident.formato;
        e.target.value = ident.replace(/\D/g, '');
    } else {
        identError.textContent = '';
    }
});

// Validación en tiempo real para el campo de email
document.getElementById('email').addEventListener('input', function(e) {
    const email = e.target.value;
    const emailError = document.getElementById('emailError');
    
    if (!regex.email.test(email)) {
        emailError.textContent = mensajesError.email.formato;
    } else {
        const afterAt = email.split('@')[1];
        if (!afterAt || !afterAt.includes('.')) {
            emailError.textContent = mensajesError.email.punto;
        } else {
            emailError.textContent = '';
        }
    }
});

// Validación en tiempo real para el campo de contraseña
document.getElementById('contrasena').addEventListener('input', function(e) {
    const contrasena = e.target.value;
    const passwordError = document.getElementById('passwordError');
    
    if (contrasena.length < 6) {
        passwordError.textContent = mensajesError.password.longitud;
    } else if (!regex.password.test(contrasena)) {
        passwordError.textContent = mensajesError.password.formato;
    } else {
        passwordError.textContent = '';
    }
}); 