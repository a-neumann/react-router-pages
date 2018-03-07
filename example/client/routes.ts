import { IRouteConfig } from "react-router-pages";

import HomePage from "./pages/HomePage";
import RootPage from "./pages/RootPage";

export default [
    {
        component: RootPage,
        routes: [
            {
                path: "/",
                exact: true,
                component: HomePage
            },
            {
                path: "/todos/:id",
                component: () => import("./pages/TodoPage").then(m => m.default),
                routes: [
                    {
                        path: "/todos/:id/edit",
                        component: () => import("./pages/TodoEditPage").then(m => m.default)
                    }
                ]
            },
            {
                path: "/help",
                component: () => import("./pages/HelpPage").then(m => m.default)
            }
        ]
    }
] as Array<IRouteConfig>;
