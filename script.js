const socket = io('http://localhost:3000');
const messagecontainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messgaeInput = document.getElementById('message-input');

const name = prompt('What is your name?');
appendMessage(`You joined ${name}`);
socket.emit('new-user', name);

socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', (uname) => {
  appendMessage(`${uname} connected`);
});

socket.on('user-disconnectd', (uname) => {
  appendMessage(`${uname} disconnectd`);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messgaeInput.value;

  appendMessage(`You: ${message}`);

  socket.emit('send-chat-message', message);
  messgaeInput.value = '';
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messagecontainer.append(messageElement);
}
