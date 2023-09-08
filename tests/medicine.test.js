const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const app = require("../app")
const processData = require("../utils/processData");
const db = require("../models");

let baseUrl = "http://localhost:3000/medicines";
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

describe('Patient Endpoints', () => {
    let medicineId1, medicineId2;
    const bodyData1 = {
        medicineName: "testMedicine1",
        cost: 1,
        expiryDate: "testExpiryDate1",
    };
    const bodyData2 = {
        medicineName: "testMedicine2",
        cost: 2,
        expiryDate: "testExpiryDate2",
    };

    it('should give empty list at first', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            }));

    it('should create a new medicine 1', async () =>
        await processData(baseUrl, bodyData1)
            .then((data) => {
                console.log(data);
                medicineId1 = data?.data?.medicineUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new medicine 2', async () =>
        await processData(baseUrl, bodyData2)
            .then((data) => {
                console.log(data);
                medicineId2 = data?.data?.medicineUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should fail to create a new medicine', async () =>
        await processData(baseUrl, bodyData2)
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(false);
                expect(data.message).toBe("medicine name already exists.");
            }));

    it('should list all medicine', () => {
        return processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should give second medicine data', () =>
        processData(`${baseUrl}/${medicineId2}`, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should update name of medicine 1', () => {
        const updateData = {patientName: "updated"};
        return processData(`${baseUrl}/${medicineId1}`, updateData, "PUT")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should delete medicine 1', async () =>
        await processData(`${baseUrl}/${medicineId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete medicine 2', async () =>
        await processData(`${baseUrl}/${medicineId2}`, {}, "DELETE")
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