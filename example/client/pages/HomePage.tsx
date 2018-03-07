import * as React from "react";

import { Page } from "react-router-pages";

export default class HomePage extends Page {

    public render() {
        return (
            <section>
                <header>Home Page</header>
                {this.renderChildPages()}
            </section>
        );
    }
}
