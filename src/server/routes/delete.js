"use strict";

import { once } from "node:events";
import { _validateToken } from "../util.js";
import { TEMPORARY_DB } from "../../db/temporary-db.js";

async function deleteTask(request, response) {
    const { id } = JSON.parse(await once(request, "data"));

    if(!id || !_validateToken(request.headers)){
        response.writeHead(400);

        let error = "";
        !id ? error = "Invalid ID"
            : error = "Not authorized";

        response.end(
            JSON.stringify({error: error})
        );
        return;
    }

    _deleteTask(id);

    response.writeHead(200);
    response.end(JSON.stringify({result: "Task deleted", task_id:id}));
}

function _deleteTask(id){
    TEMPORARY_DB.map((item, index) => {
        if(item.id === id){
            delete TEMPORARY_DB[index];
        }
    });
    return;
}

export { deleteTask };
