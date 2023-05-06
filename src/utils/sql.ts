import { Survey, Question } from "./interfaces"
import { db } from "../database/db"
/* 
SQL Query for list
*/
const sql_survey_list = ()  :string =>{
    return `
    SELECT
        id, 
        title, 
        week_num, 
        type, 
        to_char(created_on, 'YYYY-MM-DD') as created 
    FROM surveys;
    `
}

const sql_survey_retrieve = (sid : number)  :string =>{
    return `
    select
        s.id,
        s.title,
        s.week_num,
        s.type,
        to_char(s.created_on, 'YYYY-MM-DD') as created,
        JSON_AGG(
                JSON_BUILD_OBJECT(
                        'id', sq.id,
                        'body', body,
                        'is_reverse', is_reverse,
                        'type', sq.type
                    )
            ) as questions
    from surveys s
    inner join surveys_questions sq on s.id = sq.survey_id
    where s.id = ${sid}
    group by s.id;
    `
}

const sql_survey_insert = (survey : Survey)  :string =>{
    return `
    insert into surveys
    (title, week_num, type)
    values 
    (${db.escapeLiteral(survey.title)}, ${db.escapeLiteral(survey.week_num)}, ${db.escapeLiteral(survey.type)})
    RETURNING id
    `
}

const sql_survey_questiong_insert = (survey : Survey)  :string =>{
    let ret  = `
    insert into surveys_questions
    (body, is_reverse, survey_id, type)
    values 
    `;
    const questions = survey.questions.map((value, index, array)=>{
        return `(${db.escapeLiteral(value.body)}, ${value.is_reverse}, ${survey.id}, ${db.escapeLiteral(value.type)})`; // 각 요소에 10을 곱한 값을 배열로 반환
    })
    
    ret += questions.join(', ');
    return ret
}

const sql_survey_delete = (sid : number)  :string =>{
    return `
    delete
    from surveys
    where id = ${sid};
    `
}

export { 
    sql_survey_list,
    sql_survey_retrieve,
    sql_survey_insert,
    sql_survey_questiong_insert,
    sql_survey_delete
};
