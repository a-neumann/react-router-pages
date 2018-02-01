import * as React from "react";
import Page from "../../../src/Page";

export default class HomePage extends Page {

    render() {
        return (
            <section>
                <header>Home Page</header>
                {this.renderChildPages()}
            </section>
        );
    }
}