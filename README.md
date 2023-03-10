## 투표 커뮤니티

### Features

- 투표 글, 댓글 CRUD API 구현
- 투표 하기 및 중복 투표 방지 구현
- 회원가입, 로그인 구현 (JWT)
- Refresh Token blacklist 적용 (Redis)
- 이미지 파일 서버 S3 적용
- CICD 적용 (Git Action, Docker, EC2)

<br>

### DB Diagram

<img src="https://user-images.githubusercontent.com/74442264/224261659-7472e26f-f2c3-403b-9cf3-fdccd22e0787.png"  width="50%" height="50%"/>

<br>

## Tech

<img src="https://user-images.githubusercontent.com/74442264/224259667-7c2db182-e85d-46e0-abde-6a2d262f1a71.png"  width="60%" height="60%"/>

<br>

## Installation

[Node.js](https://nodejs.org/) 16+ 버전이 필요합니다. 의존성 패키지를 설치하고 서버를 실행합니다.

```sh
yarn install
yarn start:dev
```

<br>

## Docker

도커 이미지를 생성하고 컨테이너를 실행합니다.

```sh
docker build -t <IMAGE NAME> .
docker run -d -p 3000:3000 --name <CONTAINER NAME> <IMAGE NAME>
```

다음의 서버 주소로 배포를 확인할 수 있습니다.

```sh
127.0.0.1:3000
```

<br>

## CICD

<img src="https://user-images.githubusercontent.com/74442264/224263933-81d83b56-fa54-46e2-b4a3-dad88e2ac059.jpg"  width="50%" height="50%"/>
