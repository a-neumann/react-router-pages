import * as React from "react";

import { match as Match, RouteComponentProps } from "react-router";

import IRouteConfig from "./IRouteConfig";

export interface IPageComponentProps<TData, TParams> extends RouteComponentProps<TParams> {
    route: IRouteConfig<TData>;
    isNavigating?: boolean;
}

export default interface IPageComponent<TData = any, TParams = any>
    extends React.ComponentClass<IPageComponentProps<TData, TParams>> {
    loadData?: (match: Match<TParams>) => Promise<TData>;
}
