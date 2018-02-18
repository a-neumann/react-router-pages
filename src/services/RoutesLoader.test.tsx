import "jest";
import * as React from "react";
import { match } from "react-router";
import RoutesLoader from "./RoutesLoader";
import IRouteConfig from "../interfaces/IRouteConfig";
import { IPageComponentProps } from "../interfaces/IPageComponent";
import delay from "../utils/delay";

class TestPageComponent extends React.Component<IPageComponentProps<any, any>> {
    render() {
        return null;
    }
}

const loadedAsyncComponent = jest.fn();

const asyncComponentLoader = (componentClass: React.ComponentClass<IPageComponentProps<any, any>>) => {
    
    return async () => {

        await delay(1);

        const className = (componentClass).toString().match(/^class\s([A-z0-9_]+)\s/);

        loadedAsyncComponent(className[1]);
        
        return componentClass;
    };
};

const loadedRouteComponentData = jest.fn();

interface ITestPageData {
    test: string;
}

class DataLoadingTestPageComponent extends React.Component<IPageComponentProps<ITestPageData, any>> {
    
    static async loadData(match: match<any>): Promise<ITestPageData> {

        await delay(1);

        loadedRouteComponentData(match.path, match.params);

        return { test: "testData" };
    }

    render() {
        return null;
    }
}

const expectToHaveAsyncLoadingComponent = (route: IRouteConfig) => {
    
    expect(route.component.toString()).toContain("function");
};

const expectToHaveNormalComponent = (route: IRouteConfig) => {

    expect(route.component.toString()).toContain("class");
};

beforeEach(() => {
    loadedRouteComponentData.mockClear();
    loadedAsyncComponent.mockClear();
});

test("should load simple route", async (done) => {

    const testRoute: IRouteConfig = {
        component: TestPageComponent,
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);

    const loadedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(loadedRoutes).toHaveLength(1);
    expect(loadedRoutes[0]).toEqual(loader.routes[0]);

    done();
});

test("should add correct ids to routes", () => {

    const testRoute: IRouteConfig = {
        component: TestPageComponent,
        path: "/test",
        routes: [
            {
                component: TestPageComponent,
                path: "/childOne"
            },
            {
                component: TestPageComponent,
                path: "/childTwo",
                routes: [
                    {
                        component: TestPageComponent,
                        path: "/grandChildOne"
                    }
                ]
            }
        ]
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expect(loader.routes[0]).toHaveProperty("id", "0");
    expect(loader.routes[0].routes[0]).toHaveProperty("id", "0-0");
    expect(loader.routes[0].routes[1]).toHaveProperty("id", "0-1");
    expect(loader.routes[0].routes[1].routes[0]).toHaveProperty("id", "0-1-0");
});

test("should load data for component of route", async (done) => {

    const testRoute: IRouteConfig = {
        component: DataLoadingTestPageComponent,
        path: "/test/:paramOne/:paramTwo"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expect(testRoute).not.toHaveProperty("data");
    expect(loadedRouteComponentData.mock.calls).toHaveLength(0);

    const loadedRoutes = await loader.prepareMatchingRoutes("/test/11/22");

    expect(loadedRoutes).toHaveLength(1);
    expect(loadedRoutes[0]).toEqual(testRoute);
    expect(loadedRoutes[0]).toHaveProperty("data");
    expect(loadedRoutes[0].data).toEqual({ test: "testData" });
    expect(loadedRouteComponentData.mock.calls).toHaveLength(1);
    expect(loadedRouteComponentData.mock.calls[0][1]).toEqual({ paramOne: "11", paramTwo: "22" });

    done();
});

test("should load async loading component of route", async (done) => {

    const testRoute: IRouteConfig = {
        component: asyncComponentLoader(TestPageComponent),
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expectToHaveAsyncLoadingComponent(testRoute);
    expect(loadedAsyncComponent.mock.calls).toHaveLength(0);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0].path).toBe("/test");
    expectToHaveNormalComponent(testRoute);
    expect(loadedAsyncComponent.mock.calls).toHaveLength(1);

    done();
});

test("should load data after loading component", async (done) => {

    const testRoute: IRouteConfig = {
        component: asyncComponentLoader(DataLoadingTestPageComponent),
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expectToHaveAsyncLoadingComponent(testRoute);
    expect(testRoute).not.toHaveProperty("data");
    expect(loadedRouteComponentData.mock.calls).toHaveLength(0);
    expect(loadedAsyncComponent.mock.calls).toHaveLength(0);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0].path).toBe("/test");
    expectToHaveNormalComponent(testRoute);
    expect(preparedRoutes[0]).toHaveProperty("data");
    expect(preparedRoutes[0].data).toEqual({ test: "testData" });
    expect(loadedRouteComponentData.mock.calls).toHaveLength(1);
    expect(loadedAsyncComponent.mock.calls).toHaveLength(1);

    done();
});

test("should load multiple and nested routes", async (done) => {

    const routes: Array<IRouteConfig> = [
        {
            component: asyncComponentLoader(DataLoadingTestPageComponent),
            routes: [
                {
                    path: "/",
                    component: TestPageComponent,
                    routes: [
                        {
                            path: "/test",
                            component: asyncComponentLoader(TestPageComponent),
                            routes: [
                                {
                                    path: "/test/nested/:id",
                                    component: asyncComponentLoader(DataLoadingTestPageComponent)
                                }
                            ]
                        },
                        {
                            path: "/test2",
                            component: asyncComponentLoader(TestPageComponent)
                        }
                    ]
                }
            ]
        }
    ];

    expect(loadedRouteComponentData.mock.calls).toHaveLength(0);
    expect(loadedAsyncComponent.mock.calls).toHaveLength(0);

    const loader = new RoutesLoader(routes);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test/nested/123");

    expect(preparedRoutes).toHaveLength(4);
    expect(preparedRoutes[0].path).toBeFalsy();
    expect(preparedRoutes[1].path).toBe("/");
    expect(preparedRoutes[2].path).toBe("/test");
    expect(preparedRoutes[3].path).toBe("/test/nested/:id");

    expect(loadedRouteComponentData.mock.calls).toHaveLength(2);
    expect(preparedRoutes[0].data).toBeTruthy();
    expect(preparedRoutes[1].data).toBeFalsy();
    expect(preparedRoutes[2].data).toBeFalsy();
    expect(preparedRoutes[3].data).toBeTruthy();
    expect(loadedRouteComponentData.mock.calls[1][1]).toHaveProperty("id", "123");

    expect(loadedAsyncComponent.mock.calls).toHaveLength(3);
    expect(loadedAsyncComponent.mock.calls[0][0]).toBe("DataLoadingTestPageComponent");
    expect(loadedAsyncComponent.mock.calls[1][0]).toBe("TestPageComponent");
    expect(loadedAsyncComponent.mock.calls[2][0]).toBe("DataLoadingTestPageComponent");

    done();
});