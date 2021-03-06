import "jest";

import IRouteConfig from "../interfaces/IRouteConfig";
import RoutesMatcher from "./RoutesMatcher";

const fakeRoute = (path: string, routes?: Array<IRouteConfig>, config: Partial<IRouteConfig> = {}) => {
    return {
        path,
        exact: false,
        component: null,
        strict: false,
        routes,
        ...config
    } as IRouteConfig;
};

test("should match route", () => {

    const testRoute = fakeRoute("/test");

    const matcher = new RoutesMatcher([testRoute]);
    const matches = matcher.getMatches("/test");

    expect(matches).toHaveLength(1);
    expect(matches[0].path).toBe("/test");
});

test("should can get params from match", () => {

    const routeWithParams = fakeRoute("/withParams/:id");

    const matcher = new RoutesMatcher([routeWithParams]);
    const matches = matcher.getMatches("/withParams/123");

    expect(matches).toHaveLength(1);

    const routeMatch = matches[0];

    expect(routeMatch.path).toBe("/withParams/:id");
    expect(routeMatch.match).toBeTruthy();
    expect(routeMatch.match.params).toHaveProperty("id", "123");
});

test("recognizes exact routes", () => {

    const exactRoute = fakeRoute("/exact");
    exactRoute.exact = true;

    const matcher = new RoutesMatcher([exactRoute]);
    const matches = matcher.getMatches("/exact/whatever");

    expect(matches).toHaveLength(0);
});

test("recognizes strict routes", () => {

    const strictRoute = fakeRoute("/strict/");
    strictRoute.strict = true;

    const matcher = new RoutesMatcher([strictRoute]);
    const matches = matcher.getMatches("/strict");

    expect(matches).toHaveLength(0);
});

test("should match child routes", () => {

    const rootRoute = fakeRoute("/root/", [
        fakeRoute("/root/child")
    ]);

    rootRoute.exact = false;

    const matcher = new RoutesMatcher([rootRoute]);
    const matches = matcher.getMatches("/root/child/");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBe("/root/");
    expect(matches[1].path).toBe("/root/child");
});

test("should match deep nested routes", () => {

    const rootRoute = fakeRoute("/", [
        fakeRoute("/child/:id", [
            fakeRoute("/child/:id/grandchild")
        ])
    ]);

    rootRoute.exact = false;

    const matcher = new RoutesMatcher([rootRoute]);
    const matches = matcher.getMatches("/child/123/grandchild");

    expect(matches).toHaveLength(3);
    expect(matches[0].path).toBe("/");
    expect(matches[1].path).toBe("/child/:id");
    expect(matches[2].path).toBe("/child/:id/grandchild");
});

test("should match route with non-matching children", () => {

    const rootRoute = fakeRoute("/", [
        fakeRoute("/child/:id", [
            fakeRoute("/child/:id/grandchild")
        ])
    ]);

    rootRoute.exact = false;

    const matcher = new RoutesMatcher([rootRoute]);
    const matches = matcher.getMatches("/child/123");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBe("/");
    expect(matches[1].path).toBe("/child/:id");
});

test("should match only first matching route of same level", () => {

    const routes = [
        fakeRoute("/root", [
            fakeRoute("/root/:id"),
            fakeRoute("/root/123")
        ]),
        fakeRoute("/", [], { exact: false })
    ];

    const matcher = new RoutesMatcher(routes);
    const matches = matcher.getMatches("/root/123");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBe("/root");
    expect(matches[1].path).toBe("/root/:id");
});

test("should not match sole pathless route", () => {

    const pathlessRoute = fakeRoute(null);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/whatever");

    expect(matches).toHaveLength(0);
});

test("should not matching only pathless routes", () => {

    const pathlessRoute = fakeRoute(null, [
        fakeRoute(null)
    ]);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/whatever");

    expect(matches).toHaveLength(0);
});

test("should match route inside pathless route", () => {

    const pathlessRoute = fakeRoute(null, [
        fakeRoute("/child")
    ]);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/child/");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBeFalsy();
    expect(matches[1].path).toBe("/child");
});

test("pathless route should have an artificial match", () => {

    const pathlessRoute = fakeRoute(null, [
        fakeRoute("/child")
    ]);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/child");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBeFalsy();
    expect(matches[0]).toHaveProperty("match");
    expect(matches[0].match).toHaveProperty("path", "/");
});

test("should match route inside nested pathless routes", () => {

    const routes = [
        fakeRoute(null, [
            fakeRoute("/child", [
                fakeRoute(null, [
                    fakeRoute(null, [
                        fakeRoute("/child/final")
                    ])
                ]),
                fakeRoute("/child/:id")
            ])
        ])
    ];

    const matcher = new RoutesMatcher(routes);
    const matches = matcher.getMatches("/child/final");

    expect(matches).toHaveLength(5);
    expect(matches[0].path).toBeFalsy();
    expect(matches[1].path).toBe("/child");
    expect(matches[2].path).toBeFalsy();
    expect(matches[3].path).toBeFalsy();
    expect(matches[4].path).toBe("/child/final");
});
