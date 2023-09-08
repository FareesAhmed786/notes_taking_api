const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const app = require("../app")
const processData = require("../utils/processData");
const db = require("../models");

let baseUrlU = "http://localhost:3000/users";
let baseUrl = "http://localhost:3000/notebooks";
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

describe('Notebook Endpoints', () => {
    let userId1, userId2;
    let notebookId1, notebookId2;
    const userBodyData1 = {
        userName: "testUser1",
        email: "testName1@gmail.com",
        password: "password1"
    };
    const userBodyData2 = {
        userName: "testUser1",
        email: "testName1@gmail.com",
        password: "password1"
    };

    it('should give empty list at first', () => {
        return processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            });
    });

    it('should create a new user 1', async () =>
        await processData(baseUrlU, userBodyData1)
            .then((data) => {
                console.log(data);
                userId1 = data?.data?.userUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new user 2', async () =>
        await processData(baseUrlU, userBodyData2)
            .then((data) => {
                console.log(data);
                userId2 = data?.data?.userUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new notebook 1', async () => {
        const bodyData = {
            title:"Notebook1",
        }
        return await processData(baseUrl, bodyData)
            .then((data) => {
                console.log(data);
                notebookId1 = data?.data?.notebookUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should create a new appointment 2', async () => {
        const bodyData = {
            title:"Notebook2",
        }
        return await processData(baseUrl, bodyData)
            .then((data) => {
                console.log(data);
                notebookId2 = data?.data?.notebookUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should list all notebook', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should give second notebook data', () => {
        return processData(`${baseUrl}/${notebookId2}`, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should update name of notebook 1', async () => {
        const updateData = {title: "updated"};
        return await processData(`${baseUrl}/${notebookId1}`, updateData, "PUT")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should delete notebook 1', async () =>
        await processData(`${baseUrl}/${notebookId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete notebook 2', async () =>
        await processData(`${baseUrl}/${notebookId2}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

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
