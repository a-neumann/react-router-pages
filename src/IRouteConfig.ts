import IPageComponent from "./IPageComponent";

export default interface IRouteConfig {
    component: IPageComponent;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    routes?: Array<IRouteConfig>;
    id?: string;
}