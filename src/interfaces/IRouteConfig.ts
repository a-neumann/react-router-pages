import IPageComponent from "./IPageComponent";

export type LazyPageComponent = () => Promise<IPageComponent>;

export default interface IRouteConfig<TData = any> {
    component: IPageComponent<TData> | LazyPageComponent;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    routes?: Array<IRouteConfig>;
    id?: string;
    data?: TData;
}