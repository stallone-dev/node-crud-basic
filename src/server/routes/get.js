"use strict";

import { _getDBData } from "../util/db-controller.js";
import { _validateToken } from "../util/validations.js";

async function getTasks(request, response){

    const validate_token = _validateToken(request.headers);
    if(!validate_token.result){
        response.writeHead(401);
        response.end(JSON.stringify({
            error: validate_token.error, data:null
        }));
        return;
    }

    const data = _getDBData();

    response.writeHead(200);
    response.end(
        JSON.stringify({result: "Authorized request", data: data})
    );

}

export { getTasks };
