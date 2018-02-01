import { ComponentClass } from "react";
import { match, matchPath } from "react-router";
import IRouteConfig from "./IRouteConfig";
import IPageData from "./IPageData";

export interface IRouteConfigMatch {
    component: ComponentClass;
    match: match<any>;
    id: string;
}

export default class InitialRouteDataLoader {

    private routes: Array<IRouteConfig>;

    constructor(routes: Array<IRouteConfig>) {

        this.routes = routes;
        this.addAutoIds();
    }
    
    async loadData(pathname: string): Promise<Array<IPageData>> {

        const matchedRoutes = this.matchRoutes(pathname);
        const promises = matchedRoutes.map(matchingRoute => this.loadDataForRoute(matchingRoute));
    
        const allData = await Promise.all(promises);
    
        return allData.filter(d => d.data);
    }

    addAutoIds() {
        this.addAutoIdsForRoutes(this.routes);
    }

    matchRoutes(pathname: string): Array<IRouteConfigMatch> {

        return this.routesMatcher(this.routes, pathname, new Array<IRouteConfigMatch>());
    }

    private addAutoIdsForRoutes(routes: Array<IRouteConfig>, currentPrefix?: string) {

        routes.forEach((route, index) => {

            route.id = route.id || (currentPrefix ? currentPrefix + "-" + index : index.toString());

            if (route.routes) {
                this.addAutoIdsForRoutes(route.routes, route.id);
            }
        });
    };

    private routesMatcher(routes: Array<IRouteConfig>, pathname: string, matches: Array<IRouteConfigMatch>):
        Array<IRouteConfigMatch> {

        routes.some((route, index) => {
    
            const lastMatch = !!matches.length && matches[matches.length - 1] || null;
    
            // is matchable -> get real match
            // is not matchable -> take previous match if available
            // no previous match -> create artificial match
            const match = route.path ? matchPath(pathname, route) :
                lastMatch ? lastMatch.match :
                    this.createArtificialMatch(pathname);
    
            if (match) {
                matches.push({
                    component: route.component,
                    match,
                    id: route.id
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

    private loadDataForRoute = async (route: IRouteConfigMatch): Promise<IPageData> => {

        const loadData: (match: match<any>) => Promise<any> = (route.component as any).loadData;
        if (loadData) {
    
            return loadData(route.match).then(data => {
                return {
                    id: route.id,
                    data
                };
            });
        }
    
        return {
            id: route.id,
            data: null
        };
    }
}