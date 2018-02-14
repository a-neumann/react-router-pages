import "jest";
import * as React from "react";
import { match } from "react-router";
import RoutesLoader from "./RoutesLoader";
import IRouteConfig from "../interfaces/IRouteConfig";
import { IPageComponentProps } from "../interfaces/IPageComponent";
import delay from "../utils/delay";

test("should prepare simple route that must not be prepared", async () => {

    class TestPageComponent extends React.Component<IPageComponentProps<any, any>> {
        render() {
            return null;
        }
    }

    const testRoute: IRouteConfig = {
        component: TestPageComponent,
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0]).toEqual(loader.routes[0]);
});

test("should prepare a route with a data loading component", async () => {

    interface ITestPageData {
        test: string;
    }
    
    class DataLoadingTestPageComponent extends React.Component<IPageComponentProps<ITestPageData, any>> {
    
        static async loadData(match: match<any>): Promise<ITestPageData> {
    
            await delay(1);
    
            return { test: "testData" };
        }
    
        render() {
            return null;
        }
    }

    const testRoute: IRouteConfig = {
        component: DataLoadingTestPageComponent,
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expect(testRoute).not.toHaveProperty("data");

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0]).toEqual(testRoute);
    expect(preparedRoutes[0]).toHaveProperty("data");
    expect(preparedRoutes[0].data).toEqual({ test: "testData" });
});

test("should prepare a route with an async loaded component", async () => {

    class TestPageComponent extends React.Component<IPageComponentProps<any, any>> {
        render() {
            return null;
        }
    }

    const testRoute: IRouteConfig = {
        component: async () => {
            await delay(1);
            return TestPageComponent;
        },
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expect(testRoute.component.toString()).toContain("function");
    expect((testRoute.component as any)()).toBeInstanceOf(Promise);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0].path).toBe("/test");
    expect(preparedRoutes[0].component.toString()).toContain("class");
});
