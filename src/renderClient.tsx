import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import IPageData from "./IPageData";
import IRouteConfig from "./IRouteConfig";
import PageRouter from "./PageRouter";

export default (routes: Array<IRouteConfig>, initialData: Array<IPageData>) => {

    return (
        <BrowserRouter>
            <PageRouter routes={routes} initialData={initialData} />
        </BrowserRouter>
    );
};