import { hydrate, render } from "react-dom";
import { renderClient } from "react-router-pages";

import routes from "./routes";

const initReact = (jsx: JSX.Element, rootElement: Element): Promise<void> => {

    return new Promise((resolve, reject) => {

        if (!rootElement) {
            reject(new Error("Root element is mandatory."));
        }

        if (rootElement.hasChildNodes()) {
            hydrate(jsx, rootElement, resolve);
        } else {
            render(jsx, rootElement, resolve);
        }
    });
};

document.addEventListener("DOMContentLoaded", async () => {

    const initialDataScript = document.getElementById("initialData");
    const initialData = initialDataScript ? JSON.parse(initialDataScript.innerHTML) : null;

    const jsx = await renderClient(routes, initialData);

    initReact(jsx, document.getElementById("app"));
});
