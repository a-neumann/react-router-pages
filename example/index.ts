// tslint:disable:no-console

import { classToPlain } from "class-transformer";
import * as express from "express";
import * as path from "path";
import { renderToString } from "react-dom/server";
import { renderServer } from "react-router-pages";

import routes from "./client/routes";
import Todo from "./models/Todo";
import delay from "./utils/delay";

const app = express();

const template = (rendered, initialDataJson) => {
    return `<!doctype html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                section { border: 1px solid black; margin: 10px; position: relative }
                header { background: teal; }
                .loadingOverlay {
                    position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0,0,0,0.3);
                }
            </style>
            <script id="initialData" type="application/json">
                ${initialDataJson}
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

app.get("/api/todos", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    await delay(1000, 1500, "Api getting /todos");

    const json = JSON.stringify(classToPlain(todos));
    res.send(json);
});

app.get("/api/todos/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    await delay(1000, 1500, "Api getting /todos/" + req.params.id);

    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        res.status(404);

    } else {
        const json = JSON.stringify(classToPlain(todo));
        res.send(json);
    }
});

app.get("/*", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (req.url.startsWith("/public/")) {
        next();

    } else {

        console.log("Requested router URL: " + req.url);

        const ssrResult = await renderServer(routes, req.url);

        if (ssrResult.status === 200) {

            const ssrHtml = renderToString(ssrResult.jsx);
            const html = template(ssrHtml, JSON.stringify(ssrResult.initialData));

            res.status(ssrResult.status);
            res.send(html);

        } else if (ssrResult.redirectUrl) {
            res.redirect(ssrResult.status, ssrResult.redirectUrl);

        } else {
            next();
        }
    }
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000");
});
