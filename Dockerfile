FROM node:slim

# app 폴더 생성.
RUN mkdir -p /app

# 작업 폴더를 app폴더로 지정.
WORKDIR /app

# dockerfile과 같은 경로의 파일들을 app폴더로 복사
ADD ./ /app

# 패키지 파일 설치.
RUN npm install


ENV HOST=0.0.0.0 PORT=5500
EXPOSE ${PORT}

#서버 실행
CMD ["npm", "start"]