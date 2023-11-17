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
import { createTask } from "./routes/post.js";
import { getTasks } from "./routes/get.js";
import { updateTask } from "./routes/put.js";
import { deleteTask } from "./routes/delete.js";

async function handler(request, response) {

    if(request.url === "/tasks" && request.method === "POST"){
        return await createTask(request, response);
    }
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = process.env.PORT || 8080;

    if(request.url === "/tasks" && request.method === "GET"){
        return await getTasks(request, response);
    }

    if(request.url === "/tasks/put" && request.method === "POST"){
        return await updateTask(request, response);
    }

    if(request.url === "/tasks/delete" && request.method === "POST"){
        return await deleteTask(request, response);
    }

    response.writeHead(404);
    response.end(JSON.stringify({error: "Not found this route"}));
}

const app = createServer(handler).listen(3000, () => console.log("Listning at 3000"));

export { app };
