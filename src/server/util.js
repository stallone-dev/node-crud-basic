// This functions exist only for MY STUDY, not use for real aplications (probably...)

import { readFileSync, writeFileSync } from "node:fs";
import { TEMPORARY_DB } from "../db/temporary-db.js";
import { setInterval } from "node:timers";

function _getDBData(){
    return readFileSync("./src/db/db.json", {encoding: "utf-8"});
}

function _saveDBData(data){
    writeFileSync("./src/db/db.json", JSON.stringify(data), {encoding: "utf-8"});
}

// Basic verification for MY STUDY FLOW, this not really validate token
function _validateToken(headers){
    const auth = headers.authorization;
    if(auth !== "null"){
        return true;
    } else {
        return false;
    }
}

export {_getDBData, _saveDBData, _validateToken};

/*
    COMMAND TO REPRESENT DB WORKFLOW
    DON'T REALLY USE THIS IN YOUR APPLICATION
    IT IS ONLY FOR MY STUDIES
*/
const interval_to_update = 1000 * 5;
setInterval(() => {
    const _now = new Date();
    console.warn(`DB UPDATING - ${_now.toUTCString()}`);
    _saveDBData(TEMPORARY_DB);
}, interval_to_update);
