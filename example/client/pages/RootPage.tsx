import * as React from "react";

import { plainToClass } from "class-transformer";
import * as isomorphicFetch from "isomorphic-fetch";
import { Link, match as Match } from "react-router-dom";
import { Page } from "react-router-pages";

import common from "../../common";
import Todo from "../../models/Todo";

interface IRootPageData {
    todos: Array<Todo>;
}

export default class RootPage extends Page<IRootPageData> {

    public static async loadData(match: Match<any>): Promise<IRootPageData> {

        const response = await isomorphicFetch(common.apiURL + "/api/todos");
        if (response.ok) {

            const todos = plainToClass(Todo, await response.json());
            return { todos };
        }

        return null;
    }

    public render() {

        return (
            <section>
                {this.props.isNavigating && (<div className="loadingOverlay">Loading</div>)}
                <header>Root Page</header>
                <nav>
                    <Link to="/">Home</Link>
                    <br />
                    <Link to="/help">Help</Link>
                    <br />
                    {this.props.route.data && this.props.route.data.todos.map(todo => (
                        <div key={todo.id}><Link to={"/todos/" + todo.id}>{todo.name}</Link><br /></div>
                    ))}
                </nav>
                {this.renderChildPages()}
            </section>
        );
    }
}
