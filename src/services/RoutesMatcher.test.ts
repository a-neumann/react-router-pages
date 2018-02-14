import "jest";
import RoutesMatcher from "./RoutesMatcher";
import IRouteConfig from "../interfaces/IRouteConfig";

const fakeRouteWithPath = (path: string, routes?: Array<IRouteConfig>, config: Partial<IRouteConfig> = {}) => {
    return {
        component: null,
        path,
        exact: false,
        strict: false,
        routes,
        ...config
    } as IRouteConfig;
};

test("should match route", () => {

    const testRoute = fakeRouteWithPath("/test");

    const matcher = new RoutesMatcher([testRoute]);
    const matches = matcher.getMatches("/test");

    expect(matches).toHaveLength(1);
    expect(matches[0].path).toBe("/test");
});

test("should can get params from match", () => {

    const routeWithParams = fakeRouteWithPath("/withParams/:id");

    const matcher = new RoutesMatcher([routeWithParams]);
    const matches = matcher.getMatches("/withParams/123");

    expect(matches).toHaveLength(1);

    const routeMatch = matches[0];

    expect(routeMatch.path).toBe("/withParams/:id");
    expect(routeMatch.match).toBeTruthy();
    expect(routeMatch.match.params).toHaveProperty("id", "123");
});

test("recognizes exact routes", () => {

    const exactRoute = fakeRouteWithPath("/exact");
    exactRoute.exact = true;

    const matcher = new RoutesMatcher([exactRoute]);
    const matches = matcher.getMatches("/exact/whatever");

    expect(matches).toHaveLength(0);
});

test("recognizes strict routes", () => {

    const strictRoute = fakeRouteWithPath("/strict/");
    strictRoute.strict = true;

    const matcher = new RoutesMatcher([strictRoute]);
    const matches = matcher.getMatches("/strict");

    expect(matches).toHaveLength(0);
});

test("should match child routes", () => {

    const rootRoute = fakeRouteWithPath("/root/", [
        fakeRouteWithPath("/root/child")
    ]);

    rootRoute.exact = false;    

    const matcher = new RoutesMatcher([rootRoute]);
    const matches = matcher.getMatches("/root/child/");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBe("/root/");
    expect(matches[1].path).toBe("/root/child");
});

test("should match deep nested routes", () => {

    const rootRoute = fakeRouteWithPath("/", [
        fakeRouteWithPath("/child/:id", [
            fakeRouteWithPath("/child/:id/grandchild")
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

test("should match only first matching route of same level", () => {

    const routes = [
        fakeRouteWithPath("/root", [
            fakeRouteWithPath("/root/:id"),
            fakeRouteWithPath("/root/123"),
        ]),
        fakeRouteWithPath("/", [], { exact: false })
    ];

    const matcher = new RoutesMatcher(routes);
    const matches = matcher.getMatches("/root/123");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBe("/root");
    expect(matches[1].path).toBe("/root/:id");
});

test("should not match sole pathless route", () => {

    const pathlessRoute = fakeRouteWithPath(null);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/whatever");

    expect(matches).toHaveLength(0);
});

test("should not matching only pathless routes", () => {

    const pathlessRoute = fakeRouteWithPath(null, [
        fakeRouteWithPath(null)
    ]);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/whatever");

    expect(matches).toHaveLength(0);
});

test("should match route inside pathless route", () => {

    const pathlessRoute = fakeRouteWithPath(null, [
        fakeRouteWithPath("/child")
    ]);

    const matcher = new RoutesMatcher([pathlessRoute]);
    const matches = matcher.getMatches("/child/");

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBeFalsy();
    expect(matches[1].path).toBe("/child");
});

test("pathless route should have an artificial match", () => {

    const pathlessRoute = fakeRouteWithPath(null, [
        fakeRouteWithPath("/child")
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
        fakeRouteWithPath(null, [
            fakeRouteWithPath("/child", [
                fakeRouteWithPath(null, [
                    fakeRouteWithPath(null, [
                        fakeRouteWithPath("/child/final")
                    ])
                ]),
                fakeRouteWithPath("/child/:id")
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