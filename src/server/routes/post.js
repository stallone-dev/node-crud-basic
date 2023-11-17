"use strict";

import { randomInt } from "node:crypto";
import { once } from "node:events";
import { TEMPORARY_DB } from "../../db/temporary-db.js";
import {_saveDBData } from "../util/db-controller.js";
import { _validateTaskData } from "../util/validations.js";


async function createTask(request, response) {
    const { title, description } = JSON.parse(await once(request, "data"));

    const validate_data = _validateTaskData(title, description);
    if(!validate_data.result){
        response.writeHead(400);
        response.end(JSON.stringify({error: validate_data.error}));
        return;
    }

    const task_data = _configDataTask(title, description);

    TEMPORARY_DB.push(task_data);
    _saveDBData(TEMPORARY_DB);

    response.writeHead(200);
    response.end(
        JSON.stringify({result: "Task created", task_id: task_data.id})
    );
}

function _configDataTask(title, description){
    const _now = Date.now();
    const _id = "id_"+ randomInt(100000,999999) + "-" + _now;

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
