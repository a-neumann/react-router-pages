export default class Todo {
    id: number;
    name: string;
    isDone: boolean;

    constructor(name: string, isDone = false, id?: number) {
        this.name = name;
        this.isDone = isDone;
        this.id = id;
    }
}