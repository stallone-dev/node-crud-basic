"use strict";

import { _getDBData, _validateToken } from "../util.js";

async function getTasks(request, response){

    if(!_validateToken(request.headers)){
        response.writeHead(401);
        response.end(
            JSON.stringify({error: "Not authorized", data:null})
        );
        return;
    }

    const data = _getDBData();

    response.writeHead(200);
    response.end(
        JSON.stringify({result: "Authorized request", data: data})
    );

}

export { getTasks };
