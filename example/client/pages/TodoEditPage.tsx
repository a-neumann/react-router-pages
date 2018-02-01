import * as React from "react";
import { Link } from "react-router-dom";
import Page from "../../../src/Page";

interface ITodoEditPageParams {
    id: string;
}

export default class TodoPage extends Page<null, ITodoEditPageParams> {

    render() {

        const params = this.props.params;

        return (
            <section>
                <header>Edit Todo Page</header>
                <nav>
                    <Link to={`/todos/${params.id}`}>back</Link>
                </nav>
                <p>Edit Todo {params.id}</p>
            </section>
        );
    }
}