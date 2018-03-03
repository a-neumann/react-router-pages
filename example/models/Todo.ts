export default class Todo {
    public readonly id: number;
    public name: string;
    public isDone: boolean;

    constructor(name: string, isDone = false, id?: number) {
        this.name = name;
        this.isDone = isDone;
        this.id = id;
    }
}
