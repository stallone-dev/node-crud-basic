"use strict";

import { deleteTask } from "./routes/delete.js";
import { getTasks } from "./routes/get.js";
import { createTask } from "./routes/post.js";
import { updateTask } from "./routes/put.js";

const _routes = [
    {
        path: "/",
        method: "GET",
        result: async (request, response) => {
            return response.writeHead(200).end(
                JSON.stringify({result: routes.listRoutes()})
            );
        }
    },
    {
        path: "/tasks",
        method: "POST",
        result: async (request, response) => {return await createTask(request, response);}
    },
    {
        path: "/tasks",
        method: "GET",
        result: async (request, response) => {return await getTasks(request, response);}
    },
    {
        path: "/tasks",
        method: "PUT",
        result: async (request, response) => {return await updateTask(request, response);}
    },
    {
        path: "/tasks",
        method: "DELETE",
        result: async (request, response) => {return await deleteTask(request, response);}
    },

];

const routes = {
    useRoute: (url, method) => {
        let path = "";

        Object.entries(_routes).filter(item => {
            if(item[1].path === url && item[1].method === method){path = item[1].result;}
        });

        return path;
    },

    listRoutes: () => {
        let paths = [];

        Object.entries(_routes).map(item => {
            paths.push([item[1].path, item[1].method]);
        });

        return paths;
    }

};

export { routes };
