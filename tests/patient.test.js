const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const app = require("../app")
const processData = require("../utils/processData");
const db = require("../models");

let baseUrl = "http://localhost:3000/users";
let server;

beforeAll(() => {
    // Wait for previous test file to complete
    return new Promise(resolve => {
        const interval = setInterval(async () => {
            clearInterval(interval);
            server = await app.listen(3000, async () => {
                await db.sequelize.authenticate().then(() => {
                    console.log("Listening on port 3000");
                });
            });
            resolve();
        }, 100);
    });
})

afterAll(async done => {
    await server.close(done);
    console.log("Stopped listening on port 3000");
})

describe('User Endpoints', () => {
    let userId1, userId2;
    const bodyData1 = {
        userName: "testUser1",
        email: "testName1@gmail.com",
        password: "password1"
    };
    const bodyData2 = {
        userName: "testUser1",
        email: "testName1@gmail.com",
        password: "password1"
    };

    it('should give empty list at first', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            }));

    it('should create a new user 1', async () =>
        await processData(baseUrl, bodyData1)
            .then((data) => {
                console.log(data);
                userId1 = data?.data?.id ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new user 2', async () =>
        await processData(baseUrl, bodyData2)
            .then((data) => {
                console.log(data);
                userId2 = data?.data?.id ?? "";
                expect(data.success).toBe(true);
            }));

    it('should fail to create a new user', async () =>
        await processData(baseUrl, bodyData2)
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(false);
                expect(data.message).toBe("email already exists.");
            }));

    it('should list all users', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should give second user data', () =>
        processData(`${baseUrl}/${userId2}`, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should update name of user 1', () => {
        const updateData = {userName: "updated"};
        return processData(`${baseUrl}/${userId1}`, updateData, "PUT")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should delete user 1', async () =>
        await processData(`${baseUrl}/${userId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete user 2', async () =>
        await processData(`${baseUrl}/${userId2}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should give empty list at last', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            }));
});
