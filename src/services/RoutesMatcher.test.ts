import "jest";
import RoutesMatcher from "./RoutesMatcher";
import IRouteConfig from "../interfaces/IRouteConfig";

const fooRoute: IRouteConfig = {
    component: null,
    path: "/foo",
    exact: false,
    strict: false,
    routes: []
};

const fooBarRoute: IRouteConfig = {
    component: null,
    path: "/foo/bar",
    exact: false,
    strict: false,
    routes: []
};

test("can match route", () => {

    const matcher = new RoutesMatcher([fooRoute]);
    const matches = matcher.getMatches(fooRoute.path);

    expect(matches).toHaveLength(1);
    expect(matches[0].path).toBe(fooRoute.path);
});

test("matches only first top level route", () => {

    const matcher = new RoutesMatcher([fooRoute, fooBarRoute]);
    const matches = matcher.getMatches(fooBarRoute.path);

    expect(matches).toHaveLength(1);
    expect(matches[0].path).toBe(fooRoute.path);
});

test("recognizes exact routes", () => {

    const nonExactRoute = { ...fooRoute };
    nonExactRoute.exact = true;

    const matcher = new RoutesMatcher([nonExactRoute]);
    const matches = matcher.getMatches(nonExactRoute.path + "/whatever");

    expect(matches).toHaveLength(0);
});

test("recognizes strict routes", () => {

    const strictRoute = { ...fooRoute };
    strictRoute.strict = true;
    strictRoute.path += "/";

    const matcher = new RoutesMatcher([strictRoute]);
    const matches = matcher.getMatches(fooRoute.path);

    expect(matches).toHaveLength(0);
});

test("can match child route", () => {

    const rootRoute = { ...fooRoute };
    rootRoute.routes.push(fooBarRoute);

    const matcher = new RoutesMatcher([rootRoute]);
    const matches = matcher.getMatches(fooBarRoute.path);

    expect(matches).toHaveLength(2);
    expect(matches[0].path).toBe(rootRoute.path);
    expect(matches[1].path).toBe(fooBarRoute.path);
});