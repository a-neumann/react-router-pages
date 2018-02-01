import * as React from "react";
import { StaticRouter } from "react-router";
import { RouteConfig } from "react-router-config";
import PageRouter from "./PageRouter";
import IRouteConfig from "./IRouteConfig";
import InitialRouteDataLoader from "./InitialRouteDataLoader";

export interface IRouteContext {
    status?: number;
    url?: string;
}

export interface IPageRouterRenderResult {
    jsx: JSX.Element;
    status: number;
    initialData: Array<any>;
    redirectUrl?: string;
}

export default async (routes: Array<IRouteConfig>, requestPath: string): Promise<IPageRouterRenderResult> => {

    const dataLoader = new InitialRouteDataLoader(routes);
    const initialData = await dataLoader.loadData(requestPath);
    
    const context: IRouteContext = {};

    const jsx = (
        <StaticRouter location={requestPath} context={context}>
            <PageRouter routes={routes} initialData={initialData} />
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