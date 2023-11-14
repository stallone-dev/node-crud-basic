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

        it("Create new post", async () => {
            const data = {
                title: "My test",
                description: "My first test on my NodeJS application"
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 200);
            deepStrictEqual(response.result, "Post created");
        });

        it("Incorrect title key", async () => {
            const data = {
                title_: "MY TEST TITLE",
                description: "My first test on my NodeJS application"
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Not find JSON title key");
        });

        it("Incorrect description key", async () => {
            const data = {
                title: "MY TEST TITLE",
                description_: "My first test on my NodeJS application"
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Not find JSON description key");
        });

        it("Empty title", async () => {
            const data = {
                title: "",
                description: "My first test on my NodeJS application"
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Title empty");
        });

        it("Empty description", async () => {
            const data = {
                title: "MY TEST TITLE",
                description: ""
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Description empty");
        });

        it("Title is not string", async () => {
            const data = {
                title: 42,
                description: "My first test on my NodeJS application"
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Title is not string");
        });

        it("Description is not string", async () => {
            const data = {
                title: "MY TEST TITLE",
                description: 213
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Description is not string");
        });

        it("Title is to long", async () => {
            const data = {
                title: "MY LONG TEST TITLE FOR TEST ON THIS NODEJS TEST RUNNER, PROBABLY IT'S SO COOL ON REAL APLICATIONS",
                description: "My first test on my NodeJS application"
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Title is to long, max: 60 chars");
        });

        it("Description is to long", async () => {
            const data = {
                title: "MY FIRST TEST TITLE",
                description: "Lorem ipsum dolor sit amet. Est voluptas nisi sit corrupti omnis qui necessitatibus repudiandae est rerum error non veritatis aperiam id nemo dicta! Est impedit tenetur in fuga quaerat ut omnis molestiae. Et maiores doloremque sit quae maiores id tempore laudantium est eligendi deserunt ab enim corrupti. Aut accusantium obcaecati qui molestiae atque non quos quam.Ab voluptatum voluptatem nam voluptas tempora qui quisquam voluptas. Aut accusantium soluta ab voluptate ipsa eos optio repudiandae qui animi labore. Et quisquam vero id quaerat distinctio et ducimus accusantium est galisum fugiat sed eveniet quod qui dolores molestias ut ratione perferendis."
            };

            const request = await fetch(`${_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            deepStrictEqual(request.status, 400);
            deepStrictEqual(response.error, "Description is to long, max: 300 chars");
        });

        it("Minimal POST stress", async () => {
            const iterations = 100;
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

    });

    describe("GET - Workflow", ()=>{
        it("Autorized request", async () => {
            const token = "123";

            const request = await fetch(`${_URL}/tasks`, {
                method: "GET",
                headers: {authorization: token}
            });
            const response = await request.json();

            deepStrictEqual(request.status, 200);
            deepStrictEqual(response.result, "Authorized request");
            notDeepStrictEqual(response.data, null);
        });

        it("Request without token", async () => {
            const request = await fetch(`${_URL}/tasks`, {
                method: "GET",
                headers: {}
            });
            const response = await request.json();

            deepStrictEqual(request.status, 401);
            deepStrictEqual(response.error, "Not find auth");
            deepStrictEqual(response.data, null);
        });

        it("Request empty token", async () => {
            const token = "";

            const request = await fetch(`${_URL}/tasks`, {
                method: "GET",
                headers: {authorization: token}
            });
            const response = await request.json();

            deepStrictEqual(request.status, 401);
            deepStrictEqual(response.error, "Not authorized");
            deepStrictEqual(response.data, null);
        });

        it("Minimal GET stress", async () => {
            const iterations = 100;
            let req_status = new Array(iterations);
            let res_results = new Array(iterations);

            for(let i =0; i < iterations; i++){
                const token = "123";

                const request = await fetch(`${_URL}/tasks`, {
                    method: "GET",
                    headers: {authorization: token}
                });

                const response = await request.json();
                req_status[i] = request.status;
                res_results[i] = response.result;
            }

            deepStrictEqual(req_status.every(e => e === 200), true);
            deepStrictEqual(res_results.every(e => e ==="Authorized request"), true);
        });
    });

    describe("PUT - Workflow", () => {

        it("Update random task", async () => {
            const data = {
                id: _global_task_test.id,
                title: "UPDATE THIS TASK",
                description: "RANDOM TEXT TO TEST"
            };

            const request = await fetch(`${_URL}/tasks/put`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            const consult_data = Object.entries(JSON.parse(_getDBData()));
            const modified_data = [...consult_data.filter(item => item[1].id === _global_task_test.id)];

            deepStrictEqual(request.status, 200);
            deepStrictEqual(response.result, "Task updated");
            deepStrictEqual(modified_data[0][1].title, data.title);
            deepStrictEqual(modified_data[0][1].description, data.description);
            deepStrictEqual(modified_data[0][1].completed_at, null);
        });

        it("Update random task with 'completed' param", async () => {
            const data = {
                id: _global_task_test.id,
                title: "RESOLVE THIS TASK",
                description: "RANDOM FINAL TEXT TO TEST",
                completed: true,
            };

            const request = await fetch(`${_URL}/tasks/put`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            const response = await request.json();

            const consult_data = Object.entries(JSON.parse(_getDBData()));
            const modified_data = [...consult_data.filter(item => item[1].id === _global_task_test.id)];

            deepStrictEqual(request.status, 200);
            deepStrictEqual(response.result, "Task updated");
            deepStrictEqual(modified_data[0][1].title, data.title);
            deepStrictEqual(modified_data[0][1].description, data.description);
            notDeepStrictEqual(modified_data[0][1].completed, null);
        });

    });

});
