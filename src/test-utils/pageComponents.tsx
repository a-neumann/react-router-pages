// tslint:disable:max-classes-per-file

import * as React from "react";

import { match as Match } from "react-router";

import ChildRoutes from "../components/ChildRoutes";
import { IPageComponentProps } from "../interfaces/IPageComponent";
import delay from "../utils/delay";

export class TestPage extends React.Component<IPageComponentProps<any, any>> {

    public render() {
        return <h1>test-page</h1>;
    }
}

export class TestPageWithChildren extends React.Component<IPageComponentProps<any, any>> {

    public render() {
        return (
            <div>
                <h1>test-page with children</h1>
                <ChildRoutes routes={this.props.route.routes} />
            </div>
        );
    }
}

export const loadedPageDataMock = jest.fn();

interface ITestPageData {
    test: string;
}

export class DataLoadingTestPage extends React.Component<IPageComponentProps<any, any>> {

    public static async loadData(match: Match<any>): Promise<ITestPageData> {

        await delay(1);

        loadedPageDataMock(match.path, match.params);

        return { test: "testData" };
    }

    public render() {
        return (
            <div>
                <h1>data-loading-test-page</h1>
                <p className="data">test: {this.props.route.data && this.props.route.data.test}</p>
            </div>
        );
    }
}

export const asyncComponentLoaderMock = jest.fn();

export const asyncComponentLoader = (componentClass: React.ComponentClass<IPageComponentProps<any, any>>) => {

    return async () => {

        await delay(1);

        const className = (componentClass).toString().match(/^class\s([A-z0-9_]+)\s/);

        asyncComponentLoaderMock(className[1]);

        return componentClass;
    };
};
