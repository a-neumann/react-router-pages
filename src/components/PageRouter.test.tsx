import "jest";
import * as React from "react";
import { mount } from "enzyme";
import { StaticRouter, MemoryRouter, Router } from "react-router";
import { createMemoryHistory } from "history";
import PageRouter from "./PageRouter";
import { IPageComponentProps } from "../interfaces/IPageComponent";
import IRouteConfig from "../interfaces/IRouteConfig";
import { TestPage, TestPageWithChildren, DataLoadingTestPage } from "../test-utils/pageComponents";

test("should render route", () => {

    const routes: Array<IRouteConfig> = [
        {
            path: "/test",
            component: TestPage
        }
    ];

    let renderedRouter = mount(
        <StaticRouter location="/test" context={{}}>
            <PageRouter routes={routes} />
        </StaticRouter>
    );

    expect(renderedRouter.contains(<h1>test-page</h1>)).toBeTruthy();

    renderedRouter = mount(
        <StaticRouter location="/whatever" context={{}}>
            <PageRouter routes={routes} />
        </StaticRouter>
    );

    expect(renderedRouter.contains(<h1>test-page</h1>)).toBeFalsy();
});

test("should render child routes", () => {

    const routes: Array<IRouteConfig> = [
        {
            path: "/parent",
            component: TestPageWithChildren,
            routes: [
                {
                    path: "/parent/child",
                    component: TestPage
                }
            ]
        }
    ];

    const renderedWithParentPath = mount(
        <StaticRouter location="/parent/" context={{}}>
            <PageRouter routes={routes} />
        </StaticRouter>
    );

    expect(renderedWithParentPath.contains(<h1>test-page with children</h1>)).toBeTruthy();
    expect(renderedWithParentPath.contains(<h1>test-page</h1>)).toBeFalsy();

    const renderedWithChildPath = mount(
        <StaticRouter location="/parent/child/" context={{}}>
            <PageRouter routes={routes} />
        </StaticRouter>
    );

    expect(renderedWithChildPath.contains(<h1>test-page with children</h1>)).toBeTruthy();
    expect(renderedWithChildPath.contains(<h1>test-page</h1>)).toBeTruthy();
});

test("should render routes with initial data", () => {

    const routes: Array<IRouteConfig> = [
        {
            path: "/test",
            component: DataLoadingTestPage,
            id: "testRoute"
        }
    ];

    const initialData = {
        testRoute: { test: "initialData" }
    };

    const renderedRouter = mount(
        <StaticRouter location="/test" context={{}}>
            <PageRouter routes={routes} initialData={initialData} />
        </StaticRouter>
    );

    expect(renderedRouter.find(".data").text()).toBe("test: initialData");
});

test("should prepare routes on navigate", async (done) => {

    const routes: Array<IRouteConfig> = [
        {
            path: "/test",
            component: DataLoadingTestPage
        }
    ];

    const locationChanged = (nextLocation) => {

        expect(nextLocation).toBe("/test");
        expect(routes[0]).toHaveProperty("data");

        done();
    };

    const memHistory = createMemoryHistory({ initialEntries: ["/whatever"], initialIndex: 0 });

    const renderedRouter = mount(
        <Router history={memHistory}>
            <PageRouter routes={routes} onLocationChangeDone={locationChanged} />
        </Router>
    );

    memHistory.push("/test");
});
