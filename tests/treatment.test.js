const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const app = require("../app")
const processData = require("../utils/processData");
const db = require("../models");

let baseUrl = "http://localhost:3000/treatments";
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

describe('treatment Endpoints', () => {
    let treatmentId1, treatmentId2;

    it('should give empty list at first', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            }));

    it('should create a new treatment 1', async () => {
        const bodyData = {
            treatmentName: "testTreatment1",
            cost: "1",
            description: "testDescription1"
        }
        return await processData(baseUrl, bodyData)
            .then((data) => {
                console.log(data);
                treatmentId1 = data?.data?.treatmentUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should create a new treatment 2', () => {
        const bodyData = {
            treatmentName: "testTreatment2",
            cost: "2",
            description: "testDescription2"
        }
        return processData(baseUrl, bodyData)
            .then((data) => {
                console.log(data);
                treatmentId2 = data?.data?.treatmentUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should list all treatment', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should give second treatment data', async () =>
        await processData(`${baseUrl}/${treatmentId2}`, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should update name of treatment 1', async () => {
        const updateData = {treatmentName: "updated"};
        return await processData(`${baseUrl}/${treatmentId1}`, updateData, "PUT")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should delete treatment 1', async () =>
        await processData(`${baseUrl}/${treatmentId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete treatment 2', async () =>
        await processData(`${baseUrl}/${treatmentId2}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should give empty list', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            }));
});
