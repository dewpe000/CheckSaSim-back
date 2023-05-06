import express, { Express, Request, Response, NextFunction, application, Router} from 'express';
import { db } from './database/db';
import {router as survey} from './router/survey';


const app : Express = express();
const port : number = 80;

//db 연결
db.connect();

//CORS 설정
// app.use(cors<Request>());

//POST 요청 처리를 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({extended : false }));

//라우터 연결
app.use('/survey', survey);

//에러 처리
app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    console.error(err);
    res.status(500).send('Unknown Error');
});

app.listen(port, () => {
    console.log("Server Start");
});
