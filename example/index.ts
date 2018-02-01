import * as path from "path";
import { Url as URL } from "url";
import * as express from "express";
import { renderToString } from "react-dom/server";
import { classToPlain } from "class-transformer";
import routes from "./client/routes";
import renderSSR from "../src/renderSSR";
import Todo from "./models/Todo";

const app = express();

const template = (rendered, initialData) => {
    return `<!doctype html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                section { border: 1px solid black; margin: 10px; }
                header { background: teal; }
            </style>
            <script id="initialData" type="application/json">
                ${initialData}
            </script>
            <script src="/public/manifest.js"></script>
            <script defer src="/public/vendor.js"></script>
            <script defer src="/public/index.js"></script>
        </head>
        <body>
            <h1>Example</h1>
            <div id="app">${rendered}</div>
        </body>
    </html>
    `;
};

app.use("/public", express.static(path.join(__dirname, "/public")));

const todos = [
    new Todo("Optimize server rendering code", false, 1),
    new Todo("Implement client side head data rendering", false, 2),
    new Todo("Add server CSS rendering", false, 3)
];

app.get("/api/todos", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const json = JSON.stringify(classToPlain(todos));

    res.send(json);
});

app.get("/api/todos/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        res.status(404);

    } else {
        const json = JSON.stringify(classToPlain(todo));
        res.send(json);
    }
});

app.get("/*", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (req.url.startsWith("/public/")) {
        next();
    } else {
        renderSSR(routes, req.url).then(ssr => {

            const ssrHtml = renderToString(ssr.jsx);
            const initialData = JSON.stringify(ssr.initialData);
            const html = template(ssrHtml, initialData);

            if (ssr.redirectUrl) {
                res.redirect(ssr.status, ssr.redirectUrl);
            } else {
                res.status(ssr.status);
                res.send(html);
            }
        });
    }
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});