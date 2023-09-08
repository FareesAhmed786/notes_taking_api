const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const app = require("../app")
const processData = require("../utils/processData");
const db = require("../models");

let baseUrlD = "http://localhost:3000/doctors";
let baseUrlP = "http://localhost:3000/patients";
let baseUrlT = "http://localhost:3000/treatments";
let baseUrl = "http://localhost:3000/appointments";
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

describe('Appointment Endpoints', () => {
    let doctorId1, doctorId2;
    let patientId1, patientId2;
    let treatmentId1, treatmentId2;
    let appointmentId1, appointmentId2;
    const doctorBodyData1 = {
        doctorName: "testDoctor1",
        specialization: "testSpecialization1",
        email: "testDoctor1@gmail.com",
        age: 1,
        gender: "testGender1",
        phoneNumber: 12345678,
        address: "testAddress1"
    };
    const doctorBodyData2 = {
        doctorName: "testDoctor2",
        specialization: "testSpecialization2",
        email: "testDoctor2@gmail.com",
        age: 2,
        gender: "testGender2",
        phoneNumber: 1234567890,
        address: "testAddress2"
    };
    const patientBodyData1 = {
        patientName: "testPatient1",
        age: 1,
        gender: "testGender1",
        email: "testPatient1@gmail.com",
        phoneNumber: 12345678,
        dob: "testDob1",
        address: "testAddress1",
        allergies: "testAllergies1"
    };
    const patientBodyData2 = {
        patientName: "testPatient2",
        age: 2,
        gender: "testGender2",
        email: "testPatient2@gmail.com",
        phoneNumber: 123456786,
        dob: "testDob2",
        address: "testAddress2",
        allergies: "testAllergies2"
    };

    it('should give empty list at first', () => {
        return processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
                expect(data.data.length).toBe(0);
            });
    });

    it('should create a new doctor 1', async () =>
        await processData(baseUrlD, doctorBodyData1)
            .then((data) => {
                console.log(data);
                doctorId1 = data?.data?.doctorUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new doctor 2', async () =>
        await processData(baseUrlD, doctorBodyData2)
            .then((data) => {
                console.log(data);
                doctorId2 = data?.data?.doctorUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new patient 1', async () =>
        await processData(baseUrlP, patientBodyData1)
            .then((data) => {
                console.log(data);
                patientId1 = data?.data?.patientUid ?? "";
                expect(data.success).toBe(true);
            }));

    it('should create a new patient 2', () => {
        return processData(baseUrlP, patientBodyData2)
            .then((data) => {
                console.log(data);
                patientId2 = data?.data?.patientUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should create a new treatment 1', async () => {
        const bodyData = {
            treatmentName: "testTreatment1",
            cost: 13,
            description: "testDescription1"
        }
        return await processData(baseUrlT, bodyData)
            .then((data) => {
                console.log(data);
                treatmentId1 = data?.data?.treatmentUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should create a new treatment 2', async () => {
        const bodyData = {
            treatmentName: "testTreatment23",
            cost: 23,
            description: "testDescription23"
        }
        return await processData(baseUrlT, bodyData)
            .then((data) => {
                console.log(data);
                treatmentId2 = data?.data?.treatmentUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should create a new appointment 1', async () => {
        const bodyData = {
            patientUid: patientId1,
            doctorUid: doctorId1,
            treatmentUid: treatmentId1,
            appointmentDate: "2023-02-20T14:44:16.035Z",
            problem:"too many macha"
        }
        return await processData(baseUrl, bodyData)
            .then((data) => {
                console.log(data);
                appointmentId1 = data?.data?.appointmentUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should create a new appointment 2', async () => {
        const bodyData = {
            patientUid: patientId2,
            doctorUid: doctorId2,
            treatmentUid: treatmentId2,
            appointmentDate: "2023-03-20T14:44:16.035Z",
            problem: "abc"
        }
        return await processData(baseUrl, bodyData)
            .then((data) => {
                console.log(data);
                appointmentId2 = data?.data?.appointmentUid ?? "";
                expect(data.success).toBe(true);
            });
    });

    it('should list all appointment', async () =>
        await processData(baseUrl, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should give second appointment data', () => {
        return processData(`${baseUrl}/${appointmentId2}`, {}, "GET")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should update name of appointment 1', async () => {
        const updateData = {appointmentName: "updated"};
        return await processData(`${baseUrl}/${appointmentId1}`, updateData, "PUT")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            });
    });

    it('should delete appointment 1', async () =>
        await processData(`${baseUrl}/${appointmentId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete appointment 2', async () =>
        await processData(`${baseUrl}/${appointmentId2}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete treatment 1', async () =>
        await processData(`${baseUrlT}/${treatmentId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete treatment 2', async () =>
        await processData(`${baseUrlT}/${treatmentId2}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete patient 1', async () =>
        await processData(`${baseUrlP}/${patientId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete patient 2', async () =>
        await processData(`${baseUrlP}/${patientId2}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete doctor 1', async () =>
        await processData(`${baseUrlD}/${doctorId1}`, {}, "DELETE")
            .then((data) => {
                console.log(data);
                expect(data.success).toBe(true);
            }));

    it('should delete doctor 2', async () =>
        await processData(`${baseUrlD}/${doctorId2}`, {}, "DELETE")
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
