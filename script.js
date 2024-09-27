// Archivo: script.js

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
        // Aquí puedes enviar el formulario a un servidor usando fetch o AJAX.
        console.log("Formulario enviado:", { name, email, message });
        alert("Gracias por contactarnos. Te responderemos pronto.");
        this.reset(); // Limpiar el formulario después de enviarlo.
    } else {
        alert("Por favor, completa todos los campos.");
    }
});
