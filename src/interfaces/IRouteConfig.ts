import IPageComponent from "./IPageComponent";

export type LazyPageComponent = () => Promise<IPageComponent>;

export default interface IRouteConfig<TData = any> {
    path?: string;
    exact?: boolean;
    strict?: boolean;
    component: IPageComponent<TData> | LazyPageComponent;
    routes?: Array<IRouteConfig>;
    id?: string;
    data?: TData;
}
