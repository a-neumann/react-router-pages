import * as React from "react";

import { plainToClass } from "class-transformer";
import * as isomorphicFetch from "isomorphic-fetch";
import { Link, match as Match } from "react-router-dom";

import Page from "../../../src/components/Page";
import common from "../../common";
import Todo from "../../models/Todo";

interface ITodoPageParams {
    id: string;
}

interface ITodoPageData {
    todo: Todo;
}

export default class TodoPage extends Page<ITodoPageData, ITodoPageParams> {

    public static async loadData(match: Match<ITodoPageParams>): Promise<ITodoPageData> {

        const response = await isomorphicFetch(common.apiURL + "/api/todos/" + match.params.id);
        if (response.ok) {

            const todo = plainToClass<Todo, Todo>(Todo, await response.json());
            return { todo };
        }

        return null;
    }

    public render() {

        const todo = this.props.route.data ? this.props.route.data.todo : null;

        return todo && (
            <section>
                {this.props.isNavigating && (<div className="loadingOverlay">Loading</div>)}
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
