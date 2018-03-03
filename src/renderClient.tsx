import * as React from "react";

import { BrowserRouter } from "react-router-dom";

import PageRouter from "./components/PageRouter";
import IRouteConfig from "./interfaces/IRouteConfig";
import IRoutesData from "./interfaces/IRoutesData";

export default (routes: Array<IRouteConfig>, initialData?: IRoutesData) => {

    return (
        <BrowserRouter>
            <PageRouter routes={routes} initialData={initialData} />
        </BrowserRouter>
    );
};
