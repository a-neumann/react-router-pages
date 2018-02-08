import * as path from "path";
import { Url as URL } from "url";
import * as express from "express";
import { renderToString } from "react-dom/server";
import { classToPlain } from "class-transformer";
import routes from "./client/routes";
import renderSSR from "../src/renderSSR";
import Todo from "./models/Todo";

const app = express();

const template = (rendered, initialDataJson) => {
    return `<!doctype html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                section { border: 1px solid black; margin: 10px; position: relative }
                header { background: teal; }
                .loadingOverlay { position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0,0,0,0.3) }
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

app.get("/api/todos", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    setTimeout(() => {
        const json = JSON.stringify(classToPlain(todos));
        res.send(json);
    }, 2000);
});

app.get("/api/todos/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    setTimeout(() => {
        const todo = todos.find(t => t.id === Number(req.params.id));

        if (!todo) {
            res.status(404);
    
        } else {
            const json = JSON.stringify(classToPlain(todo));
            res.send(json);
        }
    }, 1500);
});

app.get("/*", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (req.url.startsWith("/public/")) {
        next();
    } else {
        renderSSR(routes, req.url).then(ssr => {

            const ssrHtml = renderToString(ssr.jsx);
            const html = template(ssrHtml, JSON.stringify(ssr.initialData));

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