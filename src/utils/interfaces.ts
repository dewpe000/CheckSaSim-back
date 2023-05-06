interface Question{
    id: number;
    body: string;
    is_reverse: boolean;
    type:string;
}

interface Answer{
    answer: string[];
}


interface Survey{
    id: number;
    title: string;
    week_num:string;
    type:string;
    answers:Answer;
    created: string;
    questions:Question[];
}

interface User{
    id: number;
    username:string;
    password:string;
}


export {
    Survey,
    Question,
    User
}
