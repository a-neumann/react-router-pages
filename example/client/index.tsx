import * as React from "react";
import { hydrate, render } from "react-dom";
import renderClient from "../../src/renderClient";
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

document.addEventListener("DOMContentLoaded", () => {

    const initialDataScript = document.getElementById("initialData");
    const initialData = initialDataScript ? JSON.parse(initialDataScript.innerHTML) : null;

    const jsx = renderClient(routes, initialData);

    initReact(jsx, document.getElementById("app"));
});
