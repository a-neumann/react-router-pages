import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import TodoEditPage from "./pages/TodoEditPage";
import HelpPage from "./pages/HelpPage";

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
                path: "/pollos/:id",
                component: TodoPage,
                routes: [
                    {
                        path: "/pollos/:id/edit",
                        component: TodoEditPage
                    },
                    {
                        path: "/pollos/:id/delete",
                        component: TodoEditPage,
                        routes: [
                            {
                                component: TodoEditPage
                            }
                        ]
                    }
                ]
            },
            {
                path: "/help",
                component: HelpPage
            }
        ]
    }
];