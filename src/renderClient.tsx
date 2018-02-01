import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import IRouteConfig from "./IRouteConfig";
import PageRouter from "./PageRouter";

export default (routes: Array<IRouteConfig>, initialDataJson?: string) => {

    const initialData = initialDataJson ?
        new Map<string, any>(JSON.parse(initialDataJson)) :
        null;

    return (
        <BrowserRouter>
            <PageRouter routes={routes} initialData={initialData} />
        </BrowserRouter>
    );
};