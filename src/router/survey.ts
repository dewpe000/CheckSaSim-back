import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_survey_list } from '../utils/sql';
import {Survey} from '../utils/interfaces';

const router : Router = Router();

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

// router.get('/', async(req : Request, res : Response) => {
//   try {
//     let content : { list : Survey[] } = {
//       list : []   
//     };

//     let sql : string = sql_survey_list();
//     content.list = (await db.query(sql)).rows;

//     res.send(content);
//   }   
//   catch(err) {
//       if(err instanceof Error) {
//           console.error("Error details: " + err.message);
//       }
//       else {
//           console.log("Unknwon Error details: " + err);
//       }

//       res.status(500).send("Fail");
//   }
// })

export { router };
