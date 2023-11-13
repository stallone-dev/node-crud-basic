import { describe, before, after, it } from "node:test";
import { deepStrictEqual, notDeepStrictEqual } from "node:assert";
import { randomInt, randomUUID } from "node:crypto";
import { TEMPORARY_DB } from "../db/temporary-db.js";

const _URL = "http://localhost:3000";

describe("API workflow - POST", () => {
    let _server = {};
    let _global_task_test = {};

    // Init and finalize tests
    before(async () => {
        _server = (await import("../server/main.js")).app;
        await new Promise(resolve => _server.once("listening", resolve));
    });

    after(done => _server.close(done));
    // ---------------------------------------------

    it("POST - Create new post", async () => {
        const data = {
            title: "My test",
            description: "My first test on my NodeJS application"
        };

        const request = await fetch(`${_URL}/tasks`, {
            method: "POST",
            body: JSON.stringify(data)
        });

        deepStrictEqual(request.status, 200);

        const response = await request.json();
        deepStrictEqual(response.result, "Post created");
    });

    it("POST - Invalid title", async () => {
        const data = {
            title: "",
            description: "My first test on my NodeJS application"
        };

        const request = await fetch(`${_URL}/tasks`, {
            method: "POST",
            body: JSON.stringify(data)
        });

        deepStrictEqual(request.status, 400);

        const response = await request.json();
        deepStrictEqual(response.error, "Invalid title");
    });

    it("POST - Invalid description", async () => {
        const data = {
            title: "My test",
            description: ""
        };

        const request = await fetch(`${_URL}/tasks`, {
            method: "POST",
            body: JSON.stringify(data)
        });

        deepStrictEqual(request.status, 400);

        const response = await request.json();
        deepStrictEqual(response.error, "Invalid description");
    });

    it("POST - Minimal stress test", async () => {
        const iterations = 10;
        let req_status = new Array(iterations);
        let res_results = new Array(iterations);

        for(let i =0; i < iterations; i++){
            const data = {
                title: randomInt(1,300000).toString(),
                description: randomUUID()
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });

            req_status[i] = request.status;
            const response = await request.json();
            res_results[i] = response.result;
        }

        deepStrictEqual(req_status.every(e => e === 200), true);
        deepStrictEqual(res_results.every(e => e ==="Post created"), true);
        _global_task_test = TEMPORARY_DB[~~(Math.random() * TEMPORARY_DB.length)];
    });

    it("GET - Returned data", async () => {
        const token = "123";

        const request = await fetch(`${_URL}/tasks`, {
            method: "GET",
            headers: {authorization: token}
        });

        deepStrictEqual(request.status, 200);

        const response = await request.json();
        deepStrictEqual(response.result, "Authorized request");
        notDeepStrictEqual(response.data, null);
    });

    it("GET - Not authorized request", async () => {
        const token = null;

        const request = await fetch(`${_URL}/tasks`, {
            method: "GET",
            headers: {authorization: token}
        });

        deepStrictEqual(request.status, 401);

        const response = await request.json();
        deepStrictEqual(response.error, "Not authorized");
        deepStrictEqual(response.data, null);
    });

    it("PUT - Update random_task with completed task", async () => {
        const data = {
            id: _global_task_test.id,
            title: "RESOLVE THIS TASK",
            description: "RANDOM TEXT TO TEST",
            completed: true
        };

        const request = await fetch(`${_URL}/tasks/put`, {
            method: "POST",
            body: JSON.stringify(data)
        });

        deepStrictEqual(request.status, 200);

        const response = await request.json();
        deepStrictEqual(response.result, "Task updated");
    });

});
