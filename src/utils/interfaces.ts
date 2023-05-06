interface Question{
    id: number;
    body: string;
    is_reverse: boolean;
    type:string;
}

interface Survey{
    id: number;
    title: string;
    week_num:string;
    type:string;
    created: string;
    questions:Question[];
}


export {
    Survey,
    Question
}
