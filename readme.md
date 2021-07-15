# chat-app-nodejs-and-socketio

- Web Dev Simplified의 [Build a Real Time Chat App With Node.js And Socket.io](https://youtu.be/rxzOqP9YwmM)을 보고 따라만들기
- nodejs에서 html과 socket.io로 간단하게 챗앱을 만드는 것을 따라 해 보았다

## 데모

[![시연영상](https://img.youtube.com/vi/9_1ujY4Flb4/0.jpg)](https://www.youtube.com/watch?v=9_1ujY4Flb4)

## 기능

- 실시간 채팅 앱
- 고유한 프로필 사진 생성(랜덤 색 + 이니셜)
- 현재 채팅에 참가한 유저 목록 위젯
- width값이 작아지면 유저 목록 위젯 숨김
- width값이 작아지면 프로필 사진 영역 숨김
- 같은 사람이 연달아 올릴 때 프로필 사진 생략
- 같은 사람이 같은 시간에 연달아 올릴 때 가장 최근 메시지에만 시간표시
- 메시지는 plain text로 표시

## 실행

### 도커로 실행

```sh
docker build . -t chat-app-nodejs-and-socketio

docker run -itd -p 5500:5500 chat-app-nodejs-and-socketio
```

### 로컬에서 실행

```sh
npm i
npm run build
npm start
```

- http://localhost:5500/ 접속

## TMI

- [TMI](./TMI.md)
- 사용한 패키지 설명 및 해결한 문제들
