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
  user_name = prompt('What is your name?').trim();
  if (user_name.length != 0) {
    break;
  }
}
const socket = io();

appendMessage({ message: `${user_name} joined` }, 'info');
socket.emit('new-user', user_name);

socket.on('chat-message', (data) => {
  appendMessage(data, 'other');
});

socket.on('user-connected', (uname) => {
  appendMessage({ message: `${uname} connected` }, 'info');
});

socket.on('user-disconnectd', (uname) => {
  appendMessage({ message: `${uname} disconnectd` }, 'info');
});

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

  switch (type) {
    case 'me':
      messageElement.className = type;

      msg = document.createElement('div');
      msg.className = 'msg';
      msg.innerHTML = message;

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
      msg.innerHTML = message;

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
      messageElement.innerHTML = message;

      break;
  }

  messagecontainer.append(messageElement);
  document
    .querySelector('#message-container')
    .scrollTo(0, document.querySelector('#message-container').scrollHeight);
}

function getChatTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  m = checkTime(m);

  return `${h}:${m}`;
}

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

function getColorByName(name) {
  const stringhash = `0.` + Math.abs(String(name).hashCode());

  var bg_colour = Math.floor(Number(stringhash) * 16777215).toString(16);
  bg_colour = '#' + ('000000' + bg_colour).slice(-6);

  return bg_colour;
}

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return '';
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2
    ? '#000000'
    : '#ffffff';
}

const input_text = document.querySelector('#message-input');
input_text.addEventListener(
  'input',
  function () {
    // event handling code for sane browsers
    // console.log(input_text.value);
    chkvalue(input_text.value.trim());
  },
  false
);

function chkvalue(text) {
  if (text.length == 0) {
    document.querySelector('#send-button').style.color = '#9e9e9e';
  } else {
    document.querySelector('#send-button').style.color = '';
  }
}

function init() {
  document.querySelector('#send-button').style.color = '#9e9e9e';
}

init();
