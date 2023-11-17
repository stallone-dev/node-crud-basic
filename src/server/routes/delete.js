"use strict";

import { once } from "node:events";
import { TEMPORARY_DB } from "../../db/temporary-db.js";
import { _saveDBData, _searchID } from "../util/db-controller.js";
import { _validateID, _validateToken } from "../util/validations.js";

async function deleteTask(request, response) {
    const { id } = JSON.parse(await once(request, "data"));

    const validate_id = _validateID(id);
    const validate_auth = _validateToken(request.headers);

    if(!validate_id.result || !validate_auth.result || !_searchID(id)){
        response.writeHead(400);

        let error = {};

        if(!validate_id.result){error["id"] = validate_id.error;}
        if(!validate_auth.result){error["auth"] = validate_auth.error;}
        if(!_searchID(id)){error["data"] = "ID not found";}

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
