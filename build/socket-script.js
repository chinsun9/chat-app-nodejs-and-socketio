const messagecontainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messgaeInput = document.getElementById('message-input');

Object.defineProperty(String.prototype, 'hashCode', {
  value: function () {
    var hash = 0,
      i,
      chr;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  },
});

let user_name;
let last_other_name;

while (true) {
  try {
    user_name = prompt('What is your name?').trim();

    if (user_name.length != 0) {
      break;
    }
  } catch (error) {
    console.log(`이름을 작성해주세요`);
  }
}

let socket = io();
socket.emit('new-user', user_name);
appendMessage({ message: `${user_name} joined` }, 'info');

let ping_loop = setInterval(() => {
  if (socket.disconnected) {
    clearInterval(ping_loop);
    return;
  }

  socket.emit('ping');
}, 1000);

socket.on('chat-message', (data) => {
  appendMessage(data, 'other');
});

socket.on('user-connected', (uname) => {
  appendMessage({ message: `${uname} connected` }, 'info');
});

socket.on('user-disconnectd', (uname) => {
  appendMessage({ message: `${uname} disconnected` }, 'info');
});

socket.on('bye', () => {
  disconnecting();
});

function disconnecting() {
  socket.disconnect();
  clearInterval(ping_loop);
  appendMessage({ message: `disconnected` }, 'info');

  // message_form disabled
  messgaeInput.value = '';
  messgaeInput.disabled = true;
  document.querySelector('#send-button').disabled = true;
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messgaeInput.value.trim();

  if (message.length == 0) {
    return;
  }

  appendMessage({ message: message });

  socket.emit('send-chat-message', message);
  messgaeInput.value = '';

  init();
  document.querySelector('#message-input').focus();
});

function appendMessage(data, type = 'me') {
  let { message, name } = data;
  if (!name) {
    name = 'unknown';
  }
  const messageElement = document.createElement('div');
  let msg, time;
  let textNode = document.createTextNode(message);

  switch (type) {
    case 'me':
      messageElement.className = type;

      msg = document.createElement('div');
      msg.className = 'msg';
      msg.appendChild(textNode);

      time = document.createElement('div');
      time.className = 'time';
      time.innerHTML = getChatTime();

      messageElement.appendChild(msg);
      messageElement.appendChild(time);
      last_other_name = '';

      break;
    case 'other':
      messageElement.className = type;
      const profileimg = document.createElement('div');
      profileimg.className = 'profileimg';
      profileimg.innerHTML = name[0].toUpperCase();
      profileimg.style.backgroundColor = getColorByName(name);
      profileimg.style.color = getColorByBgColor(
        profileimg.style.backgroundColor
      );

      const namentime = document.createElement('div');
      namentime.className = 'namentime';

      const uname = document.createElement('div');
      uname.className = 'uname';
      uname.innerHTML = name;

      msg = document.createElement('div');
      msg.className = 'msg';
      msg.appendChild(textNode);

      time = document.createElement('div');
      time.className = 'time';
      time.innerHTML = getChatTime();

      if (last_other_name != name) {
        messageElement.appendChild(profileimg);
        namentime.appendChild(uname);
      }
      namentime.appendChild(msg);
      namentime.appendChild(time);

      messageElement.appendChild(namentime);
      last_other_name = name;
      break;

    default:
      messageElement.className = type;
      messageElement.appendChild(textNode);

      break;
  }

  messagecontainer.append(messageElement);
  document
    .querySelector('#message-container')
    .scrollTo(0, document.querySelector('#message-container').scrollHeight);
}

messgaeInput.addEventListener(
  'input',
  function () {
    chkvalue(messgaeInput.value.trim());
  },
  false
);
