import express, { Express, Request, Response, NextFunction, application, Router} from 'express';
import { db } from './database/db';
import {router as survey} from './router/survey';
import {router as login} from './router/login';


const app : Express = express();
const port : number = 80;
const cors = require('cors');
export const session = require('express-session');
const MemoryStore = require('memorystore')(session);


const maxAge = 1000 * 60 * 60;
const sessionObj = {
    secret: 'kong',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: {
      maxAge: maxAge
    },
  };

//db 연결
db.connect();

//CORS 설정


//POST 요청 처리를 위한 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false }));
app.use(session(sessionObj));

//라우터 연결
app.use('/user', login);
app.use('/survey', survey);

//에러 처리
app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    console.error(err);
    res.status(500).send('Unknown Error');
});

app.listen(port, () => {
    console.log("Server Start");
});
