import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_survey_delete, sql_survey_list, sql_survey_retrieve, sql_survey_question_insert,sql_survey_answer_insert ,sql_survey_insert } from '../utils/sql';
import {Survey} from '../utils/interfaces';
import { session } from '../app';
const router : Router = Router();

router.get('/:id', async(req : Request, res : Response) => {
  try {
    const sid:number = parseInt(req.params.id)
    if(!Number.isInteger(sid)){
      throw 'Not Number'
    }

    let content : { results : any } = {
      results : {}
    };
    
    const sql : string = sql_survey_retrieve(sid);
    content.results = (await db.query(sql)).rows[0];

    res.send(content);
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

router.get('/', async(req : Request, res : Response) => {
  try {
    let content : { results : Survey[] } = {
      results : []
    };
    let sql : string = sql_survey_list();
    content.results = (await db.query(sql)).rows;

    res.send(content);
  }   
  catch(err) {
      if(err instanceof Error) {
          console.error("Error details: " + err.message);
      }
      else {
          console.log("Unknwon Error details: " + err);
      }

      res.status(500).send("Fail");
  }
})

router.post('/', async(req : Request, res : Response) => {
  try {
    if (req.headers.cookie) {
      const [cid, ] = req.headers.cookie.split(';');
      const [, privateKey] = cid.split('=');
      const userInfo = session[privateKey];
      if(!userInfo) {
        res.status(400).send("not authorized");
        return 0;
      }
    } else {
     res.status(400).send("not authorized")
     return 0;
    }
    let content : { results : Survey[] } = {
      results : []   
    };
    
    const survey : Survey = req.body;
    const sql1 : string = sql_survey_insert(survey);
    
    survey.id  = (await db.query(sql1)).rows[0].id
    
    const sql2 : string = sql_survey_question_insert(survey);

    console.log(sql2)

    const sql3 : string = sql_survey_answer_insert(survey);

    content.results = (await db.query(sql2)).rows;
    content.results = (await db.query(sql3)).rows;
    res.send('success');
  }   
  catch(err) {
      if(err instanceof Error) {
          console.error("Error details: " + err.message);
      }
      else {
          console.log("Unknwon Error details: " + err);
      }

      res.status(500).send("Fail");
  }
})

router.delete('/:id', async(req : Request, res : Response) => {
  try {
    if (req.headers.cookie) {
     const [cid, ] = req.headers.cookie.split(';');
     const [, privateKey] = cid.split('=');
     const userInfo = session[privateKey];
     if(!userInfo) {
       res.status(400).send("not authorized");
       return 0;
     }
    } else {
     res.status(400).send("not authorized")
     return 0;
    }
    const sid:number = parseInt(req.params.id)
    if(!Number.isInteger(sid)){
      throw 'Not Number'
    }

    const sql : string =sql_survey_delete(sid);
    const results = (await db.query(sql));
    console.log(results);
    res.send("sucess");
  }   
  catch(err) {
      if(err instanceof Error) {
          console.error("Error details: " + err.message);
      }
      else {
          console.log("Unknwon Error details: " + err);
      }

      res.status(500).send("Fail");
  }
})

export { router };
