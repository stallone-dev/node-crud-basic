/*
    =======================================================================
    This project is my first CRUD experiment, its very, very simple project

    I decided not to use EXPRESS to understand more deeply how ROUTES are formed in NodeJs

    Initial conclusion: Is very simple

    In this project, the following technologies are used:
    -- NodeJS >= 20.6.0
    -- node:http => for creating server
    -- node:events => for capture user data
    -- node:crypto =>for create rudimentary IDs from tasks
    -- node:fs => for access and modify JSON file (beginner)
    -- node:test and node:assert => for automated testing

    This project started in: 11/11/2023
    This project first version: 13/11/23
    This procjet final version: 16/11/23 (After revisions)

    =======================================================================
    author: Stallone L. de Souza
    github: https://github.com/stallone-dev
    linkedin: https://www.linkedin.com/in/stallone-souza/
 */

"use strict";

import { createServer } from "node:http";
import { routes } from "./routes.js";
import { _validateRoute } from "./util/validations.js";

const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = process.env.PORT || 8080;

async function handler(request, response) {
    const {url, method} = request;

    const validate_route = _validateRoute(url, method);

    if(validate_route){
        const route = routes.useRoute(url, method);
        return await route(request,response);
    } else {
        response.writeHead(404).end(JSON.stringify({error: "Not found this route"}));
    }
}

const app = createServer(handler).listen(port, hostname, () => {console.log(`Server running at http://${hostname}:${port}/`);});

export { app };
