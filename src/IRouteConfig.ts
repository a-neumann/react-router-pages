import { ComponentClass } from "react";

export default interface IRouteConfig {
    component: ComponentClass;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    routes?: Array<IRouteConfig>;
    id?: string;
}