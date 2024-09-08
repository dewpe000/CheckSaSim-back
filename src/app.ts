import express, {
  Express,
  Request,
  Response,
  NextFunction,
  application,
  Router,
} from "express";
import { db } from "./database/db";
import { router as survey } from "./router/survey";
import { router as login } from "./router/login";
import { test } from "node:test";
import { readFileSync } from "fs";

const app: Express = express();
const port: number = 80;
const cors = require("cors");
const cookieParser = require("cookie-parser");
export const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const session_info: string = readFileSync(
  "./src/utils/session_info.json",
  "utf8"
);
const session_secret: string = JSON.parse(session_info).secret;

const maxAge = 1000 * 60 * 60;
const sessionObj = {
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({ checkPeriod: maxAge }),
  cookie: { path: "/", sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 },
};

//db 연결
db.connect();

app.set("trust proxy", 1);

//CORS 설정
app.use(
  cors({
    origin: "https://sasimi.site",
    credentials: true,
  })
);

app.use(cookieParser());

//POST 요청 처리를 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionObj));

//라우터 연결
app.use("/user", login);
app.use("/survey", survey);

//에러 처리
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Unknown Error");
});

app.listen(port, () => {
  console.log("Server Start");
});
