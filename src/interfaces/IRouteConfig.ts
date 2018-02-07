import IPageComponent from "./IPageComponent";

export type LazyPageComponent = () => Promise<IPageComponent>;

export default interface IRouteConfig {
    component: IPageComponent | LazyPageComponent;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    routes?: Array<IRouteConfig>;
    id?: string;
}