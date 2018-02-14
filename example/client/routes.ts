import IRouteConfig from "../../src/interfaces/IRouteConfig";
import delay from "../../src/utils/delay";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import TodoEditPage from "./pages/TodoEditPage";
import HelpPage from "./pages/HelpPage";

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