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

function changeNickname() {
    let nickname = prompt('Choose your nickname');

    if (nickname) {
        socket.emit('set_nickname', nickname);
    }
}

changeNickname();