const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const app = require("../app");
const processData = require("../utils/processData");
const db = require("../models");

let baseUrl = "http://localhost:3000/doctors";
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
});


afterAll(async done => {
    await server.close(done);
    console.log("Stopped listening on port 3000");
})

describe('Doctor Endpoints', () => {
    let doctorId1, doctorId2;
    const bodyData1 = {
        doctorName: "testDoctor1",
        specialization: "testSpecialization1",
        email: "testFirstName1@gmail.com",
        age: 1,
        gender: "testGender1",
        phoneNumber: 12345678,
        address: "testAddress1"
    };
    const bodyData2 = {
        doctorName: "testDoctor2",
        specialization: "testSpecialization2",
        email: "testFirstName2@gmail.com",
        age: 2,
        gender: "testGender2",
        phoneNumber: 1234567890,
        address: "testAddress2"
    };

    it('should give empty list at first', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            }));

    it('should create a new doctor 1', async () =>
        await processData(baseUrl, bodyData1)
            .then((data) => {
                console.log(data);
                doctorId1 = data?.data?.doctorUid ?? "";
                expect(data.success).toBe(true);
                expect(data.data.email).toBe(bodyData1.email);
            }));

    it('should create a new doctor 2', async () =>
        await processData(baseUrl, bodyData2)
            .then((data) => {
                console.log(data);
                doctorId2 = data?.data?.doctorUid ?? "";
                expect(data.success).toBe(true);
                expect(data.data.email).toBe(bodyData2.email);
            }));

    it('should fail to create a new doctor', async () =>
        await processData(baseUrl, bodyData2)
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(false);
                expect(data.message).toBe("email already exists.");
            }));

    it('should list all doctor', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(2);
            }));

    it('should give second doctor data', async () =>
        await processData(`${baseUrl}/${doctorId2}`, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.email).toBe(bodyData2.email);
            }));

    it('should update name of doctor 1', async () => {
        const updateData = {doctorName: "updated"};
        return await processData(`${baseUrl}/${doctorId1}`, updateData, "PUT")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.doctorName).toBe("updated");
            });
    });

    it('should delete doctor 1', async () =>
        await processData(`${baseUrl}/${doctorId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete doctor 2', async () =>
        await processData(`${baseUrl}/${doctorId2}`, {}, "DELETE")
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
