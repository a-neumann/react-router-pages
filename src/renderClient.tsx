import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import IRouteConfig from "./interfaces/IRouteConfig";
import IRoutesData from "./interfaces/IRoutesData";
import PageRouter from "./components/PageRouter";

export default (routes: Array<IRouteConfig>, initialData?: IRoutesData) => {

    return (
        <BrowserRouter>
            <PageRouter routes={routes} initialData={initialData} />
        </BrowserRouter>
    );
};