document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    const message = '¡Feliz Día del Programador!';
    let index = 0;

    function typeMessage() {
        if (index < message.length) {
            messageElement.textContent += message[index];
            index++;
            setTimeout(typeMessage, 100);
        }
    }

    typeMessage();
});
