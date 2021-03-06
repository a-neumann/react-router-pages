import { match as Match, matchPath, RouteProps } from "react-router";
import IRouteConfig from "../interfaces/IRouteConfig";

export interface IRouteConfigMatch extends IRouteConfig {
    match: Match<any>;
}

export default class RoutesMatcher {

    private routes: Array<IRouteConfig>;

    constructor(routes: Array<IRouteConfig>) {

        this.routes = routes;
    }

    public getMatches(pathname: string) {

        const matches = new Array<IRouteConfigMatch>();

        const exactMatched = this.matchedChildRoute(this.routes, pathname, matches);

        return exactMatched ? matches : [];
    }

    private matchedChildRoute(routes: Array<IRouteConfig>, pathname: string, matches: Array<IRouteConfigMatch>)
        : boolean {

        for (const route of routes) {

            if (route.path) {

                const match = matchPath(pathname, route as RouteProps);

                if (match) {
                    // found a matching route with a real path

                    const routeMatch = route as IRouteConfigMatch;
                    routeMatch.match = match;

                    matches.push(routeMatch);

                    if (routeMatch.routes && routeMatch.routes.length) {
                        this.matchedChildRoute(routeMatch.routes, pathname, matches);
                    }

                    return true;
                }
            } else {
                // found a route without a path

                const lastRouteMatch = !!matches.length && matches[matches.length - 1] || null;
                const artificialRouteMatch = route as IRouteConfigMatch;
                artificialRouteMatch.match =
                    lastRouteMatch &&
                    lastRouteMatch.match ||
                    this.createArtificialMatch(pathname);

                matches.push(artificialRouteMatch);

                if (!artificialRouteMatch.routes || !artificialRouteMatch.routes.length) {
                    return false;
                }

                return this.matchedChildRoute(artificialRouteMatch.routes, pathname, matches);
            }
        }

        return false;
    }

    private createArtificialMatch(pathname: string): Match<any> {

        return {
            params: {},
            isExact: pathname === "/",
            path: "/",
            url: "/"
        };
    }
}
