import * as React from "react";
import { Link, match } from "react-router-dom";
import * as isomorphicFetch from "isomorphic-fetch";
import { plainToClass } from "class-transformer";
import Page from "../../../src/Page";
import Todo from "../../models/Todo";
import common from "../../common";

interface ITodoPageParams {
    id: string;
}

interface ITodoPageData {
    todo: Todo;
}

export default class TodoPage extends Page<ITodoPageData, ITodoPageParams> {

    static async loadData(match: match<ITodoPageParams>): Promise<ITodoPageData> {

        const response = await isomorphicFetch(common.apiURL + "/api/todos/" + match.params.id);
        if (response.ok) {

            const todo = plainToClass<Todo, Todo>(Todo, await response.json());
            return { todo };
        }

        return null;
    }

    render() {

        const todo = this.props.data ? this.props.data.todo : null;

        return todo && (
            <section>
                <header>Todo Page</header>
                <nav>
                    <Link to={`/todos/${todo.id}/edit`}>edit</Link>
                </nav>
                <p>{todo.name}</p>
                <p>{todo.isDone ? "done" : "open"}</p>
                {this.renderChildPages()}
            </section>
        );
    }
}