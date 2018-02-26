import * as React from "react";
import { match } from "react-router";
import IRouteConfig, { LazyPageComponent } from "../interfaces/IRouteConfig";
import IPageComponent from "../interfaces/IPageComponent";
import IRoutesData from "../interfaces/IRoutesData";
import isReactComponent from "../utils/isReactComponent";
import RoutesMatcher from "./RoutesMatcher";

export default class RoutesLoader {

    readonly routes: Array<IRouteConfig>;

    protected routesMatcher: RoutesMatcher;

    constructor(routes: Array<IRouteConfig>) {

        this.routes = this.addAutoIdsToRoutes(routes);
        this.routesMatcher = new RoutesMatcher(this.routes);
    }
    
    async prepareMatchingRoutes(pathname: string): Promise<Array<IRouteConfig>> {

        const matches = this.routesMatcher.getMatches(pathname);

        if (!matches.length) {
            return [];
        }

        const promises = matches.map(routeMatch => this.prepareRoute(routeMatch, routeMatch.match));
    
        return await Promise.all(promises);
    }

    addDataToRoutes(data: IRoutesData) {

        const dataMap = new Map<string, any>();
        Object.keys(data).forEach(key => dataMap.set(key, data[key]));

        this.distributeDataMap(dataMap, this.routes);
    }

    private async loadData(component: IPageComponent, match: match<any>) {

        const loadDataMethod = component.loadData;
        if (loadDataMethod) {

            return await loadDataMethod(match);
        }

        return null;
    }

    private async loadComponent(route: IRouteConfig) {

        if (!route.component) {
            throw new Error("Routes does not have a component!");
        }

        if (isReactComponent(route.component)) {

            return route.component as IPageComponent;
        }
        
        const lazyComponent = route.component as LazyPageComponent;

        return await lazyComponent();
    }

    private async prepareRoute(route: IRouteConfig, match: match<any>) {

        const component = await this.loadComponent(route);
        route.component = component;

        if (component.loadData) {
            route.data = await this.loadData(component, match);
        }

        return route;
    }

    private distributeDataMap(dataMap: Map<string, any>, routes: Array<IRouteConfig>) {

        for (const route of routes) {

            if (dataMap.size <= 0) {
                break;
            }

            const data = dataMap.get(route.id);
            if (data) {
                route.data = data;
                dataMap.delete(route.id);
            }

            if (route.routes) {
                this.distributeDataMap(dataMap, route.routes);
            }
        }
    }

    private addAutoIdsToRoutes(routes: Array<IRouteConfig>, currentPrefix?: string) {

        routes.forEach((route, index) => {

            route.id = route.id || (currentPrefix ? currentPrefix + "-" + index : index.toString());

            if (route.routes) {
                this.addAutoIdsToRoutes(route.routes, route.id);
            }
        });

        return routes;
    }
}