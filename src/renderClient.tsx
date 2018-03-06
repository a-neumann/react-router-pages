import * as React from "react";

import { BrowserRouter } from "react-router-dom";

import PageRouter from "./components/PageRouter";
import IRouteConfig from "./interfaces/IRouteConfig";
import IRoutesData from "./interfaces/IRoutesData";
import RoutesLoader from "./services/RoutesLoader";

export default async (routes: Array<IRouteConfig>, initialData?: IRoutesData) => {

    const routesLoader = new RoutesLoader(routes);
    routesLoader.addDataToRoutes(initialData);
    await routesLoader.prepareMatchingRoutes(window.location.pathname, false);

    return (
        <BrowserRouter>
            <PageRouter routesLoader={routesLoader} />
        </BrowserRouter>
    );
};
