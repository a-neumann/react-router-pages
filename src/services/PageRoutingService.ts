import * as React from "react";
import { match } from "react-router";
import IRouteConfig, { LazyPageComponent } from "../interfaces/IRouteConfig";
import IPageComponent from "../interfaces/IPageComponent";
import RoutesMatcher, { IRouteConfigMatch } from "./RoutesMatcher";

export interface IRouteDataMatch extends IRouteConfigMatch {
    data?: any;
}

export default class PageRoutingService {

    private routes: Array<IRouteConfig>;

    private routesMatcher: RoutesMatcher;

    constructor(routes: Array<IRouteConfig>) {

        this.routes = this.addAutoIdsForRoutes(routes);
        this.routesMatcher = new RoutesMatcher(this.routes);
    }
    
    async loadData(pathname: string): Promise<Array<IRouteDataMatch>> {

        const matches = this.routesMatcher.getMatches(pathname);
        const promises = matches.map(routeMatch => this.loadDataForRoute(routeMatch));
    
        return await Promise.all(promises);
    }

    private addAutoIdsForRoutes(routes: Array<IRouteConfig>, currentPrefix?: string) {

        routes.forEach((route, index) => {

            route.id = route.id || (currentPrefix ? currentPrefix + "-" + index : index.toString());

            if (route.routes) {
                this.addAutoIdsForRoutes(route.routes, route.id);
            }
        });

        return routes;
    };


    private isReactComponentClass(component: any) {

        return !!(component && component.prototype && component.prototype.render);
    }

    private async loadDataForRoute(routeMatch: IRouteConfigMatch): Promise<IRouteDataMatch> {

        const routeDataMatch: IRouteDataMatch = routeMatch;
        let component = routeMatch.route.component;

        // load component if necessary
        if (!this.isReactComponentClass(component)) {

            const lazyComponent = component as LazyPageComponent;
            routeMatch.route.component = await lazyComponent();
        }

        // load data if static method available
        const loadData: (match: match<any>) => Promise<any> = (component as IPageComponent).loadData;
        if (loadData) {

            try {
                const result = await loadData(routeMatch.match);
                routeDataMatch.data = result;

            } catch (error) {

                const idName = routeMatch.id || "[no id]";
                console.error(`Could not load data for route "${idName}" matching URL "${routeMatch.match.url}".`);
            }
        }

        return routeDataMatch;
    }
}