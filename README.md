# sing-me-a-song

## Description
This is a small fullstack application that anonimously receives youtube video recommendations.
Users can upvote or downvote the sent videos to change its scores. The higher the score of a video, the more it is recommended for users.
This project is mainly intended to have end-to-end (e2e), integration and unit tests applied.

## Installation
```bash
$ git clone https://github.com/teles-tarcisio/sing-me-a-song
```

### Backend installation:
```bash
$ cd sing-me-a-song/back-end/
$ npm i
```
### Frontend installation:
```bash
$ cd sing-me-a-song/front-end/
$ npm i
```

## Usage:

### To start the backend server:
```bash
$ cd sing-me-a-song/back-end/
$ npm run prisma:migrate-test
$ npm run dev:test
```

### To start the frontend server:
```bash
$ cd sing-me-a-song/front-end/
$ npm run start
```
### To run E2E tests:
With the backend started and running on another terminal, open a new terminal and do:
```bash
 $ cd sing-me-a-song/front-end/
 $ npm run start
 $ npm run test:cypress
```

### To run integration tests:
On a single terminal, do:
```bash
$ cd sing-me-a-song/back-end/
$ npm run test:integration
```

### To run unit tests:
On a single terminal, do:
```bash
$ cd sing-me-a-song/back-end/
$ npm run test:unit
```