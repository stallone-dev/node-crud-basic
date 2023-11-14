"use strict";

import { once } from "node:events";
import { _saveDBData, _validateID, _validateToken } from "../util.js";
import { TEMPORARY_DB } from "../../db/temporary-db.js";

async function deleteTask(request, response) {
    const { id } = JSON.parse(await once(request, "data"));

    const validate_id = _validateID(id);
    const validate_auth = _validateToken(request.headers);

    if(!validate_id.result || !validate_auth.result){
        response.writeHead(400);

        let error = {};

        if(!validate_id.result){error["id"] = validate_id.error;}
        if(!validate_auth.result){error["auth"] = validate_auth.error;}

        response.end(JSON.stringify({error: error}));
        return;
    }

    _deleteTask(id);
    _saveDBData(TEMPORARY_DB);

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
