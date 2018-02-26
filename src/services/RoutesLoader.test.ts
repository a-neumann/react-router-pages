import "jest";
import RoutesLoader from "./RoutesLoader";
import IRouteConfig from "../interfaces/IRouteConfig";
import { loadedPageDataMock, asyncComponentLoaderMock, TestPage, DataLoadingTestPage, asyncComponentLoader } from "../test-utils/pageComponents";
import { expectToHaveAsyncLoadingComponent, expectToHaveNormalComponent } from "../test-utils/routeAssertions";


beforeEach(() => {
    loadedPageDataMock.mockClear();
    asyncComponentLoaderMock.mockClear();
});

test("should load simple route", async (done) => {

    const testRoute: IRouteConfig = {
        component: TestPage,
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
        component: TestPage,
        path: "/test",
        routes: [
            {
                component: TestPage,
                path: "/childOne"
            },
            {
                component: TestPage,
                path: "/childTwo",
                routes: [
                    {
                        component: TestPage,
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
        component: DataLoadingTestPage,
        path: "/test/:paramOne/:paramTwo"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expect(testRoute).not.toHaveProperty("data");
    expect(loadedPageDataMock.mock.calls).toHaveLength(0);

    const loadedRoutes = await loader.prepareMatchingRoutes("/test/11/22");

    expect(loadedRoutes).toHaveLength(1);
    expect(loadedRoutes[0]).toEqual(testRoute);
    expect(loadedRoutes[0]).toHaveProperty("data");
    expect(loadedRoutes[0].data).toEqual({ test: "testData" });
    expect(loadedPageDataMock.mock.calls).toHaveLength(1);
    expect(loadedPageDataMock.mock.calls[0][1]).toEqual({ paramOne: "11", paramTwo: "22" });

    done();
});

test("should add data to routes", async (done) => {

    const testRoute: IRouteConfig = {
        component: TestPage,
        path: "/test/:paramOne",
        id: "parentRoute",
        routes: [
            {
                component: DataLoadingTestPage,
                path: "/test/:paramOne/:paramTwo",
                id: "childRoute",
                data: { test: "should be replaced" }
            }
        ]
    };

    const loader = new RoutesLoader([testRoute]);

    const parentTestData = { test: "parent test data" };
    const childTestData = { test: "child test data" };

    loader.addDataToRoutes({
        parentRoute: parentTestData,
        childRoute: childTestData
    });
    
    expect(loader.routes).toContain(testRoute);
    expect(loadedPageDataMock.mock.calls).toHaveLength(0);
    expect(testRoute).toHaveProperty("data", parentTestData);
    expect(testRoute.routes[0]).toHaveProperty("data", childTestData);

    const loadedRoutes = await loader.prepareMatchingRoutes("/test/11/22");

    expect(loadedPageDataMock.mock.calls).toHaveLength(1);
    expect(testRoute).toHaveProperty("data", parentTestData);
    expect(testRoute.routes[0]).toHaveProperty("data");
    expect(testRoute.routes[0]).not.toHaveProperty("data", childTestData);

    done();
});

test("should load async loading component of route", async (done) => {

    const testRoute: IRouteConfig = {
        component: asyncComponentLoader(TestPage),
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expectToHaveAsyncLoadingComponent(testRoute);
    expect(asyncComponentLoaderMock.mock.calls).toHaveLength(0);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0].path).toBe("/test");
    expectToHaveNormalComponent(testRoute);
    expect(asyncComponentLoaderMock.mock.calls).toHaveLength(1);

    done();
});

test("should load data after loading component", async (done) => {

    const testRoute: IRouteConfig = {
        component: asyncComponentLoader(DataLoadingTestPage),
        path: "/test"
    };

    const loader = new RoutesLoader([testRoute]);
    
    expect(loader.routes).toContain(testRoute);
    expectToHaveAsyncLoadingComponent(testRoute);
    expect(testRoute).not.toHaveProperty("data");
    expect(loadedPageDataMock.mock.calls).toHaveLength(0);
    expect(asyncComponentLoaderMock.mock.calls).toHaveLength(0);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test");

    expect(preparedRoutes).toHaveLength(1);
    expect(preparedRoutes[0].path).toBe("/test");
    expectToHaveNormalComponent(testRoute);
    expect(preparedRoutes[0]).toHaveProperty("data");
    expect(preparedRoutes[0].data).toEqual({ test: "testData" });
    expect(loadedPageDataMock.mock.calls).toHaveLength(1);
    expect(asyncComponentLoaderMock.mock.calls).toHaveLength(1);

    done();
});

test("should load multiple and nested routes", async (done) => {

    const routes: Array<IRouteConfig> = [
        {
            component: asyncComponentLoader(DataLoadingTestPage),
            routes: [
                {
                    path: "/",
                    component: TestPage,
                    routes: [
                        {
                            path: "/test",
                            component: asyncComponentLoader(TestPage),
                            routes: [
                                {
                                    path: "/test/nested/:id",
                                    component: asyncComponentLoader(DataLoadingTestPage)
                                }
                            ]
                        },
                        {
                            path: "/test2",
                            component: asyncComponentLoader(TestPage)
                        }
                    ]
                }
            ]
        }
    ];

    expect(loadedPageDataMock.mock.calls).toHaveLength(0);
    expect(asyncComponentLoaderMock.mock.calls).toHaveLength(0);

    const loader = new RoutesLoader(routes);

    const preparedRoutes = await loader.prepareMatchingRoutes("/test/nested/123");

    expect(preparedRoutes).toHaveLength(4);
    expect(preparedRoutes[0].path).toBeFalsy();
    expect(preparedRoutes[1].path).toBe("/");
    expect(preparedRoutes[2].path).toBe("/test");
    expect(preparedRoutes[3].path).toBe("/test/nested/:id");

    expect(loadedPageDataMock.mock.calls).toHaveLength(2);
    expect(preparedRoutes[0].data).toBeTruthy();
    expect(preparedRoutes[1].data).toBeFalsy();
    expect(preparedRoutes[2].data).toBeFalsy();
    expect(preparedRoutes[3].data).toBeTruthy();
    expect(loadedPageDataMock.mock.calls[1][1]).toHaveProperty("id", "123");

    expect(asyncComponentLoaderMock.mock.calls).toHaveLength(3);
    expect(asyncComponentLoaderMock.mock.calls[0][0]).toBe("DataLoadingTestPage");
    expect(asyncComponentLoaderMock.mock.calls[1][0]).toBe("TestPage");
    expect(asyncComponentLoaderMock.mock.calls[2][0]).toBe("DataLoadingTestPage");

    done();
});
