import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_survey_delete, sql_survey_list, sql_survey_retrieve } from '../utils/sql';
import {Survey} from '../utils/interfaces';

const router : Router = Router();

router.get('/:id', async(req : Request, res : Response) => {
  try {
    const sid:number = parseInt(req.params.id)
    if(!Number.isInteger(sid)){
      throw 'Not Number'
    }

    let content : { results : Survey[] } = {
      results : []   
    };
    
    const sql : string = sql_survey_retrieve(sid);
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

router.delete('/:id', async(req : Request, res : Response) => {
  try {
    const sid:number = parseInt(req.params.id)
    if(!Number.isInteger(sid)){
      throw 'Not Number'
    }

    const sql : string =sql_survey_delete(sid);
    const results = (await db.query(sql));

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
