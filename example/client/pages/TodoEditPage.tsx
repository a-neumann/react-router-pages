import * as React from "react";
import { Link } from "react-router-dom";
import Page from "../../../src/Page";

interface ITodoEditPageParams {
    id: string;
}

export default class TodoPage extends Page<ITodoEditPageParams> {

    render() {
        return (
            <section>
                <header>Edit Todo Page</header>
                <nav>
                    <Link to={`/todos/${this.params.id}`}>back</Link>
                </nav>
                <p>Edit Todo {this.params.id}</p>
            </section>
        );
    }
}