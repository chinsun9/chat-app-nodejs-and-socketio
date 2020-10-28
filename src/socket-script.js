export default function () {
  const messagecontainer = document.getElementById('message-container');
  const messageForm = document.getElementById('send-container');
  const messgaeInput = document.getElementById('message-input');

  let user_name;
  let last_other_color;
  let last_message;

  let isReading = false;

  while (true) {
    try {
      user_name = prompt('What is your name?').trim();

      if (user_name.length != 0) {
        user_name = user_name.substring(0, 10);
        break;
      }
    } catch (error) {
      console.log(`이름을 작성해주세요`);
    }
  }

  var socket = io({
    reconnection: false,
  });
  socket.emit('new-user', user_name);
  appendMessage({ message: `${user_name} joined` }, 'info');

  socket.on('chat-message', (data) => {
    appendMessage(data, 'other');
  });

  socket.on('user-connected', (uname) => {
    appendMessage({ message: `${uname} connected` }, 'info');
  });

  socket.on('user-disconnected', (uname) => {
    appendMessage({ message: `${uname} disconnected` }, 'info');
  });

  socket.on('disconnect', () => {
    disconnecting();
  });

  socket.on('bye', () => {
    disconnecting();
  });

  function disconnecting() {
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
    let { message, name, color } = data;
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

        if (last_message?.className == 'me') {
          setVisibilityTime(last_message, time);
        }

        last_other_color = '';
        last_message = messageElement;
        break;
      case 'other':
        messageElement.className = type;
        const profileimg = document.createElement('div');
        profileimg.className = 'profileimg';
        profileimg.innerHTML = name[0].toUpperCase();
        profileimg.style.backgroundColor = color;
        profileimg.style.color = getColorByBgColor(color);

        const namentime = document.createElement('div');
        namentime.className = 'namentime';

        const uname = document.createElement('div');
        uname.className = 'uname';

        uname.appendChild(document.createTextNode(name));

        msg = document.createElement('div');
        msg.className = 'msg';
        msg.appendChild(textNode);

        time = document.createElement('div');
        time.className = 'time';
        time.innerHTML = getChatTime();

        if (last_other_color != color) {
          messageElement.appendChild(profileimg);
          namentime.appendChild(uname);
        } else {
          setVisibilityTime(last_message, time);
        }

        namentime.appendChild(msg);
        namentime.appendChild(time);

        messageElement.appendChild(namentime);
        last_other_color = color;

        last_message = namentime;
        break;

      default:
        messageElement.className = type;
        messageElement.appendChild(textNode);
        last_other_color = '';

        setTimeout(() => {
          getUserList();
        }, 300);

        break;
    }

    messagecontainer.append(messageElement);

    if (!isReading) {
      messagecontainer.scrollBy({
        top: messagecontainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  messgaeInput.addEventListener(
    'input',
    function () {
      chkvalue(messgaeInput.value.trim());
    },
    false
  );

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

  const listbox = document.querySelector('#user-list > ul');

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

  function chkvalue(text) {
    if (text.length == 0) {
      document.querySelector('#send-button').style.color = '#9e9e9e';
    } else {
      document.querySelector('#send-button').style.color = '';
    }
  }

  function setVisibilityTime(parentElement, time) {
    let time_element;

    for (var i = 0; i < parentElement.childNodes.length; i++) {
      if (parentElement.childNodes[i].className == 'time') {
        time_element = parentElement.childNodes[i];
        break;
      }
    }

    if (time_element?.innerHTML == time.innerHTML) {
      time_element.style.display = 'none';
    }
  }

  function getUserList() {
    //   listbox 초기화
    let newListbox = document.createElement('li');
    newListbox.innerHTML = `<li class="list-group-item head">User List</li>`;

    const url = '/users';
    const fetchResponsePromise = fetch(url);
    fetchResponsePromise
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on api server!');
        }
      })
      .then((response) => {
        console.log(`fetch`, response);
        let i = 0;
        for (const key in response) {
          i++;
          if (response.hasOwnProperty(key)) {
            const element = response[key];

            const new_li_element = document.createElement('li');
            new_li_element.className = 'list-group-item';
            new_li_element.appendChild(document.createTextNode(element));
            newListbox.appendChild(new_li_element);
          }
        }
        listbox.innerHTML = newListbox.innerHTML;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function init() {
    document.querySelector('#send-button').style.color = '#9e9e9e';
  }

  init();

  // 스크롤 위치에 따라 isReading 값 토글
  messagecontainer.addEventListener('scroll', function (e) {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    // console.info(offsetHeight + scrollTop, scrollHeight);
    if (!isReading && scrollHeight - (offsetHeight + scrollTop) >= 60) {
      isReading = true;
      // console.info(isReading);
    } else if (isReading && scrollHeight - (offsetHeight + scrollTop) < 60) {
      isReading = false;
      // console.info(isReading);
    }
  });
}
