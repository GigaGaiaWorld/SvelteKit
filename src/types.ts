export interface Todo {
    id:number;
    description:string;
    done:boolean;
}

export interface Event {
    id:number;
    date: Date;
    event: string;
    event_type: string;
}