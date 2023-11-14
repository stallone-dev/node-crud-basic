"use strict";

import { once } from "node:events";
import { TEMPORARY_DB } from "../../db/temporary-db.js";
import { _saveDBData, _validateID,_validateTaskData } from "../util.js";

async function updateTask(request, response) {
    const { id, title, description, completed=false } = JSON.parse(await once(request, "data"));

    const validate_id = _validateID(id);
    const validate_data = _validateTaskData(title, description);

    if( !validate_id.result || !validate_data.result ){
        response.writeHead(400);
        let error = {};

        if(!validate_id.result){error["id"] = validate_id.error;}
        if(!validate_data.result){error["data"] = validate_data.error;}

        response.end(JSON.stringify({error: error}));
        return;
    }

    _updateTasks(id, title, description, completed);
    _saveDBData(TEMPORARY_DB);

    response.writeHead(200);
    response.end(JSON.stringify({result: "Task updated", task_id:id}));
}


function _updateTasks(id, title, description, completed){
    const actual_data = TEMPORARY_DB;

    for(let item=0, MAX_ITERATOR = actual_data.length; item < MAX_ITERATOR; item++){
        const data = actual_data[item];

        if(data.id === id){_configureTask(data, title, description, completed);}

        TEMPORARY_DB[item] = data;
    }

    return;
}

function _configureTask(data_to_update, title, description, completed){
    const _now = Date.now();

    data_to_update.title        = title;
    data_to_update.description  = description;
    data_to_update.updated_ad   = _now;
    data_to_update.completed_at = completed ? _now : null;

    return data_to_update;
}

export { updateTask };
