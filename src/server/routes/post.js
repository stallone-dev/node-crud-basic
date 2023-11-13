"use strict";

import { randomInt } from "node:crypto";
import { once } from "node:events";
import { TEMPORARY_DB } from "../../db/temporary-db.js";

async function createTask(request, response) {
    const { title, description } = JSON.parse(await once(request, "data"));

    if( !title || !description ){
        response.writeHead(400);
        let error = "";

        if(!title){error = "Invalid title";}
        if(!description){error = "Invalid description";}

        response.end(JSON.stringify({error: error}));
        return;
    }

    const task_data = _configDataTask(title, description);

    TEMPORARY_DB.push(task_data);

    response.writeHead(200);
    response.end(
        JSON.stringify({result: "Post created", task_id: task_data.id})
    );
}

function _configDataTask(title, description){
    const _now = Date.now();
    const _id = randomInt(100000,999999) + "-" + _now;

    const task_data = {
        id: _id,
        title: title,
        description: description,
        created_at: _now,
        updated_ad: _now,
        completed_at: null
    };

    return task_data;
}


export { createTask };
