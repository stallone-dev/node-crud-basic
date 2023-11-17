"use strict";

// This functions exist only for MY STUDY, not use for real aplications (probably...)

import { readFileSync, writeFileSync } from "node:fs";

function _getDBData(){
    return readFileSync("./src/db/db.json", {encoding: "utf-8"});
}

function _saveDBData(data){
    writeFileSync("./src/db/db.json", JSON.stringify(data), {encoding: "utf-8"});
}

function _searchID(id){
    const actual_data = Object.entries(JSON.parse(_getDBData()));

    for(let item=0, MAX_ITERATOR = actual_data.length; item < MAX_ITERATOR; item++){
        if(actual_data[item][1] === null){return false;}
        if(actual_data[item][1].id === id){return true;}
    }

    return false;
}

export { _getDBData, _saveDBData, _searchID };
