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
    console.log(last_message.childNodes[i]);
    if (last_message.childNodes[i].className == 'time') {
      time_element = last_message.childNodes[i];
      break;
    }
  }

  if (time_element?.innerHTML == time.innerHTML) {
    time_element.style.display = 'none';
  }
}

function init() {
  document.querySelector('#send-button').style.color = '#9e9e9e';
}

init();
