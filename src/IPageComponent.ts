import * as React from "react";
import { RouteProps, match } from "react-router";
import IRouteConfig from "./IRouteConfig";

export interface IPageComponentProps<TPageData, TParams> extends RouteProps {
    data: TPageData;
    params: TParams;
    route: IRouteConfig;
    isNavigating?: boolean;
}

export default interface IPageComponent<TPageData = any, TParams = any>
    extends React.ComponentClass<IPageComponentProps<TPageData, TParams>> {
    loadData?: (match: match<TParams>) => Promise<TPageData>
}