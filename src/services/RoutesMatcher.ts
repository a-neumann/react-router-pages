import { match, matchPath, RouteProps } from "react-router";
import IRouteConfig from "../interfaces/IRouteConfig";

export interface IRouteConfigMatch extends IRouteConfig {
    match: match<any>;
}

export default class RoutesMatcher {

    private routes: Array<IRouteConfig>;

    constructor(routes: Array<IRouteConfig>) {

        this.routes = routes;
    }

    getMatches(pathname: string) {

        return this.routesMatcher(this.routes, pathname, new Array<IRouteConfigMatch>());
    }

    private routesMatcher(routes: Array<IRouteConfig>, pathname: string, matches: Array<IRouteConfigMatch>) {

        routes.some((route, index) => {
    
            const lastMatch = !!matches.length && matches[matches.length - 1] || null;
    
            // is matchable -> get real match
            // is not matchable -> take previous match if available
            // no previous match -> create artificial match
            const match = route.path ? matchPath(pathname, route as RouteProps) :
                lastMatch ? lastMatch.match :
                    this.createArtificialMatch(pathname);
    
            if (match) {
                matches.push({
                    ...route,
                    match
                });
    
                if (route.routes) {
                    this.routesMatcher(route.routes, pathname, matches);
                }
            }
    
            return !!match;
        });
    
        return matches;
    }

    private createArtificialMatch(pathname: string): match<any> {

        return {
            path: "/",
            url: "/",
            params: {},
            isExact: pathname === "/"
        };
    }
}