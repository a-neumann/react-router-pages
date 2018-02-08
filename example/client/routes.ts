import IRouteConfig from "../../src/interfaces/IRouteConfig";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import TodoEditPage from "./pages/TodoEditPage";
import HelpPage from "./pages/HelpPage";

const helpPageLoader = () => new Promise((res, rej) => {
    console.log("loading HelpPage");
    setTimeout(() => {
        console.log("loaded HelpPage complete");
        res(HelpPage);
    }, 1000);
});

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
                component: TodoPage,
                routes: [
                    {
                        path: "/todos/:id/edit",
                        component: TodoEditPage
                    }
                ]
            },
            {
                path: "/help",
                component: helpPageLoader
            }
        ]
    }
] as Array<IRouteConfig>;