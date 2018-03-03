import IRouteConfig from "../../src/interfaces/IRouteConfig";
import delay from "../../src/utils/delay";
import HelpPage from "./pages/HelpPage";
import HomePage from "./pages/HomePage";
import RootPage from "./pages/RootPage";
import TodoEditPage from "./pages/TodoEditPage";
import TodoPage from "./pages/TodoPage";

let HelpPageComponent: any = null;
const helpPageLoader = async () => {

    if (!HelpPageComponent) {

        await delay(500, 1000, "loading HelpPage");

        HelpPageComponent = HelpPage;
    }

    return HelpPageComponent;
};

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
