import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_user_login } from '../utils/sql';
import {User} from '../utils/interfaces'
import {session} from '../app';
const router : Router = Router();

router.post('/login', async(req : Request, res : Response) => {
  try 
  {
    const user : User = req.body;
    const sql : string = sql_user_login(user);
    const is_exist = (await db.query(sql)).rows;
    console.log(is_exist)
    if (is_exist.length!=0) {
      const privateKey = Math.floor(Math.random() * 1000000000);
      console.log(privateKey);
      session[privateKey] = user;
      console.log(session);
      res.setHeader('Set-Cookie', `connect.id=${privateKey}; path=/`);
      res.send('login success');
    } else {
      res.send('login fail');
    }   
  }
  catch(err) {
      if(err instanceof Error) {
          console.error("Error details: " + err.message);
      }
      else {
          console.log("Unknwon Error details: " + err);
      }

      res.status(401).send("Bad request");
  }
})

router.get('/logout', async(req : Request, res : Response) => {
  try 
  {
    if (req.headers.cookie) {
      if (req.headers.cookie) {
        const [cid, ] = req.headers.cookie.split(';');
        const [, privateKey] = cid.split('=');
        delete session[privateKey];
        res.setHeader('Set-Cookie', 'connect.id=delete; Max-age=0; path=/');
        res.send('logout success');
      } else {
        res.send('not login yet');
      }
    }
  }
  catch(err) {
      if(err instanceof Error) {
          console.error("Error details: " + err.message);
      }
      else {
          console.log("Unknwon Error details: " + err);
      }

      res.status(401).send("Bad request");
  }
})


export { router };
