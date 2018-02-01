import * as React from "react";
import { Link, match } from "react-router-dom";
import * as isomorphicFetch from "isomorphic-fetch";
import { plainToClass } from "class-transformer";
import Page from "../../../src/Page";
import Todo from "../../models/Todo";
import common from "../../common";

interface IRootPageData {
    todos: Array<Todo>;
}

export default class RootPage extends Page<null, IRootPageData> {

    static async loadData(match: match<any>): Promise<IRootPageData> {

        const response = await isomorphicFetch(common.apiURL + "/api/todos");
        if (response.ok) {

            const todos = plainToClass(Todo, await response.json());
            return { todos };
        }

        return null;
    }

    render() {

        return (
            <section>
                <header>Root Page</header>
                <nav>
                    <Link to="/">Home</Link>
                    <br />
                    <Link to="/help">Help</Link>
                    <br />
                    {this.data && this.data.todos.map(todo =>
                        <div key={todo.id}><Link to={"/todos/" + todo.id}>{todo.name}</Link><br /></div>
                    )}
                </nav>
                {this.renderChildPages()}
            </section>
        );
    }
}