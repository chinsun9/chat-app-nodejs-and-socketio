# chat-app-nodejs-and-socketio

- Web Dev Simplified의 [Build a Real Time Chat App With Node.js And Socket.io](https://youtu.be/rxzOqP9YwmM)을 보고 따라만들기
- nodejs에서 html과 socket.io로 간단하게 챗앱을 만드는 것을 따라해보았다.

## 데모

[![시연영상](https://img.youtube.com/vi/9_1ujY4Flb4/0.jpg)](https://www.youtube.com/watch?v=9_1ujY4Flb4)

## socket.io

```cmd cmd
npm i socket.io
```

- socket.io 설치

```js server/socket.js
const io = require('socket.io')(3000);
```

- 서버도 정말 간단하게 만들 수 있다.
- express없이 사용했을 때 소스 코드는 `server/socket.js`에서 확인할 수 있다.

```js server/index.js
const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
```

- express랑 같이 사용할때 `server/index.js`를 확인하면 된다.

```html build/index.html
<script defer src="/socket.io/socket.io.js"></script>
<script defer src="script.js"></script>
```

- html에서 세팅
- `/socket.io/socket.io.js`스크립트로 서버와 html이 연결된다

```js build/script.js
const socket = io();
```

- html script 에서는..
- `/socket.io/socket.io.js`에 정의된 io()를 통해 소켓 통신할 수 있다.

## nodemon

- 개발할때 소스 코드 변경을 감지해서 자동 재시작해준다
- 이번에 처음 써봤는데 엄청 좋다. Ctrl + C, Up-arrow, Enter 탈출..

## express

- 서빙

## Docker 올리기

```Dockerfile Dockerfile
FROM node:slim

# app 폴더 생성.
RUN mkdir -p /app

# 작업 폴더를 app폴더로 지정.
WORKDIR /app

# dockerfile과 같은 경로의 파일들을 app폴더로 복사
ADD ./ /app

# 패키지 파일 설치.
RUN npm install


#서버 실행
CMD ["npm", "start"]
```

- Dockerfile 생성

```
docker build . -t chat-app-nodejs-and-socketio

docker run -itd -p 5500:5500 chat-app-nodejs-and-socketio
```

- 이미지 생성 및 실행 명령

## 발생한 문제들..

### ???

- script가 로딩되지 않는 오류..
- 그냥 다시 처음부터 하니 없어졌다.

### socket io client 자동 reconnect

```
delete users[socket.id];
```

- 디스커넥트하면 서버에서 해당 유저를 users 객체해서 삭제하는 로직이 있었다.
- 근데 클라이언트에서 다시 접속했을때 리커넥션이 되어서 통신이 되었다.

```
const socket = io({
  reconnection: false,
});
```

- 리커넥트하지 않도록 바꾸었다.

### parcel 적용

```
Server running at http://localhost:5809 - configured port 1234 could not be used.
×  C:\git\chat-app-nodejs-and-socketio\build\socket.io\socket.io.js: ENOENT: no such file or directory, open 'C:\git\chat-app-nodejs-and-socketio\build\socket.io\socket.io.js'
Error: ENOENT: no such file or directory, open 'C:\git\chat-app-nodejs-and-socketio\build\socket.io\socket.io.js'
```

- 이런 오류가 있었는데 무시했다.

#### socket.io cdn

```html index.html
<script defer src="/socket.io/socket.io.js"></script>

<script
  defer
  src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.1/socket.io.js"
></script>
```

- 이런방식으로 하니까 parcel 오류가 나서 cdn 방식으로 바꿨다

### script:src

```html index.html
<script defer src="main.js"></script>
```

```js main.js
import socket_script from './socket-script';

socket_script();
```

- utils.js를 scoket_script.js로 합쳤다.
- 그리고 main.js를 새로만들어서 임포트했다.
- index.html에는 main.js만 연결했다.

### favicon

- 잘나오던 favicon이 안나오기 시작했다.

```html
<link rel="icon" href="../public/favicon.ico" />
```

- index.html에 favion을 명시해주었다.
- `"express-favicon": "^2.0.1",` 은 필요없어져서 없애버렸다
