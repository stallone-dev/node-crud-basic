"use strict";

import { routes } from "../routes.js";

function _validateRoute(url, method){
    const _routes = routes.listRoutes();

    const _exists = (url, method) => {
        return _routes.map(item => item[0] === url && item[1] === method);
    };

    if(_exists(url, method).includes(true)){
        return true;
    }

    return false;
}

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
    if(id.length !== 23){
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

export { _validateRoute, _validateToken, _validateID, _validateTaskData };
