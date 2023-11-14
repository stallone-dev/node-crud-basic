import { describe, before, after, it } from "node:test";
import { deepStrictEqual, notDeepStrictEqual } from "node:assert";
import { randomInt, randomUUID } from "node:crypto";
import { TEMPORARY_DB } from "../db/temporary-db.js";
import { _getDBData } from "../server/util.js";

const _URL = "http://localhost:3000";

describe("API workflows", () => {
    let _server = {};
    let _global_task_test = {};

    // Init and finalize tests
    before(async () => {
        _server = (await import("../server/main.js")).app;
        await new Promise(resolve => _server.once("listening", resolve));
    });

    after(done => _server.close(done));
    // ---------------------------------------------

    describe("POST - Workflow", () => {

    });

    describe("GET - Workflow", ()=>{

    });

    describe("PUT - Workflow", () => {

    });

});
