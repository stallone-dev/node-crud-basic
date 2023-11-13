"use strict";

import { once } from "node:events";
import { TEMPORARY_DB } from "../../db/temporary-db.js";

async function updateTask(request, response) {
    const { id, title, description, completed=false } = JSON.parse(await once(request, "data"));

    if( !id || !title || !description ){
        response.writeHead(400);
        let error = "";

        if(!id){error = "Invalid ID";}
        if(!title){error = "Invalid title";}
        if(!description){error = "Invalid description";}

        response.end(JSON.stringify({error: error}));
        return;
    }

    _updateTasks(id, title, description, completed);

    response.writeHead(200);
    response.end(JSON.stringify({result: "Task updated", task_id:id}));
}


function _updateTasks(id, title, description, completed){
    const actual_data = TEMPORARY_DB;

    for(let lin=0, MAX_ITERATOR = actual_data.length; lin < MAX_ITERATOR; lin++){
        const data = actual_data[lin];

        if(data.id === id){_configureTask(data, title, description, completed);}

        TEMPORARY_DB[lin] = data;
    }

    return;
}

function _configureTask(data_to_update, title, description, completed){
    const _now = Date.now();

    data_to_update.title = title;
    data_to_update.description = description;
    data_to_update.updated_ad = _now;
    if(completed){data_to_update.completed_at = _now;}

    return data_to_update;
}

export { updateTask };
