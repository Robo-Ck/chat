const socket = io();
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (input.value) {
        socket.emit('new_message', input.value);
        input.value = '';
    }
});

// Отримання всіх повідомлень
socket.on('all_messages', function(allMessages) {
    messages.innerHTML = '';

    allMessages.forEach(msg => {
        const item = document.createElement('li');
        item.textContent = `${msg.login}: ${msg.content}`;
        messages.appendChild(item);
    });

    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('message', function(msg) {
    let item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});