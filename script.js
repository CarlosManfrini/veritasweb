// Autenticación básica
const users = {
    'usuario1': 'password1',
    'admin': 'adminpass'
};

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('user-name').textContent = username;
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// Función para generar un PDF (usa librerías como jsPDF para crear PDFs)
function generatePDF() {
    const votes = {
        party1: document.getElementById('votes1').value,
        party2: document.getElementById('votes2').value,
        // Obtener más datos según sea necesario
    };

    const observations = document.getElementById('observations').value;

    const doc = new jsPDF();
    doc.text('Votos del Usuario:', 10, 10);
    doc.text(`Partido 1: ${votes.party1}`, 10, 20);
    doc.text(`Partido 2: ${votes.party2}`, 10, 30);
    doc.text('Observaciones:', 10, 40);
    doc.text(observations, 10, 50);

    // Descarga el PDF
    doc.save('votos.pdf');

    // Lógica para enviar por WhatsApp usando API de WhatsApp
    sendToWhatsApp();
}

// Enviar PDF a un número de WhatsApp
function sendToWhatsApp() {
    const number = 'YOUR_WHATSAPP_NUMBER';  // Cambiar por el número real
    const message = 'Envio de votos. Archivo adjunto: votos.pdf';

    const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
