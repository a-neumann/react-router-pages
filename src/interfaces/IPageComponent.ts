import * as React from "react";
import { RouteComponentProps, match } from "react-router";
import IRouteConfig from "./IRouteConfig";

export interface IPageComponentProps<TPageData, TParams> extends RouteComponentProps<TParams> {
    route: IRouteConfig;
    isNavigating?: boolean;
}

export default interface IPageComponent<TPageData = any, TParams = any>
    extends React.ComponentClass<IPageComponentProps<TPageData, TParams>> {
    loadData?: (match: match<TParams>) => Promise<TPageData>
}