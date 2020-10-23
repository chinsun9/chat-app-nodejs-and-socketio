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
const listboxwrapper = document.querySelector('#user-list');

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

function setVisibilityTime(last_message, time) {
  let time_element;

  for (var i = 0; i < last_message.childNodes.length; i++) {
    if (last_message.childNodes[i].className == 'time') {
      time_element = last_message.childNodes[i];
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
      response = JSON.parse(response);
      let i = 0;
      for (const key in response) {
        i++;
        if (response.hasOwnProperty(key)) {
          const element = response[key];

          const new_li_element = document.createElement('li');
          new_li_element.className = 'list-group-item';
          new_li_element.innerHTML = element;
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
