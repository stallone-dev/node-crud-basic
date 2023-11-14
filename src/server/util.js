// This functions exist only for MY STUDY, not use for real aplications (probably...)

import { readFileSync, writeFileSync } from "node:fs";

function _getDBData(){
    return readFileSync("./src/db/db.json", {encoding: "utf-8"});
}

function _saveDBData(data){
    writeFileSync("./src/db/db.json", JSON.stringify(data), {encoding: "utf-8"});
}

// Basic validations for MY STUDY FLOW, don't really use this (maybe)

function _validateToken(headers){
    let result = false;
    let error = "";

    const auth = headers.authorization;
    if(auth === undefined){
        error = "Not find auth";
        return {result, error};
    }
    if(auth === "null" || auth === "" || auth === null){
        let error = "Not authorized";
        return {result, error};
    }

    result = true;
    return {result, error};
}

function _validateID(id){
    let result = false;
    let error = "";

    if(id === undefined){
        error = "Not find JSON ID key";
        return {result, error};
    }
    if(id === "" || id === null){
        error = "ID empty";
        return {result, error};
    }
    if(typeof(id) !== "string"){
        error = "ID is not string";
        return {result, error};
    }
    if(id.length !== 20){
        error = "ID is not correctly size";
        return {result, error};
    }

    result = true;
    return {result, error};
}

function _validateTaskData(title, description){
    let result = false;
    let error = "";

    if(title === undefined){
        error = "Not find JSON title key";
        return {result, error};
    }
    if(description === undefined){
        error = "Not find JSON description key";
        return {result, error};
    }

    if(title === "" || title === null){
        error = "Title empty";
        return {result, error};
    }
    if(description === "" || description === null){
        error = "Description empty";
        return {result, error};
    }

    if(typeof(title) !== "string"){
        error = "Title is not string";
        return {result, error};
    }
    if(typeof(description) !== "string"){
        error = "Description is not string";
        return {result, error};
    }

    if(title.length > 60){
        error = "Title is to long, max: 60 chars";
        return {result, error};
    }
    if(description.length > 300){
        error = "Description is to long, max: 300 chars";
        return {result, error};
    }

    result = true;
    return {result, error};
}

export {_getDBData, _saveDBData, _validateToken, _validateID, _validateTaskData};
