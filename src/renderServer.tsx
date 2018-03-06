import * as React from "react";

import { StaticRouter } from "react-router";

import PageRouter from "./components/PageRouter";
import IRouteConfig from "./interfaces/IRouteConfig";
import IRoutesData from "./interfaces/IRoutesData";
import RoutesLoader from "./services/RoutesLoader";

export interface IRouteContext {
    status?: number;
    url?: string;
}

export interface IPageRouterRenderResult {
    jsx: JSX.Element;
    status: number;
    initialData: IRoutesData;
    redirectUrl?: string;
}

export default async (routes: Array<IRouteConfig>, requestPath: string): Promise<IPageRouterRenderResult> => {

    const routesLoader = new RoutesLoader(routes);
    const matchingRoutes = await routesLoader.prepareMatchingRoutes(requestPath);

    if (matchingRoutes.length <= 0) {

        return {
            jsx: null,
            status: 404,
            initialData: null
        };
    }

    const initialData: IRoutesData = {};
    for (const route of matchingRoutes) {
        if (route.data) {
            initialData[route.id] = route.data;
        }
    }

    const context: IRouteContext = {};

    const jsx = (
        <StaticRouter location={requestPath} context={context}>
            <PageRouter routesLoader={routesLoader} />
        </StaticRouter>
    );

    const { status, url } = context;
    const redirected = status >= 300 && status < 400;

    return {
        jsx,
        status: status || 200,
        initialData,
        redirectUrl: redirected ? url : null
    };
};
