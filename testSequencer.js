const BaseTestSequencer = require('@jest/test-sequencer').default;

class CustomTestSequencer extends BaseTestSequencer {
    constructor() {
        super();
        this.order = [
            "user.test.js",
            "doctor.test.js",
            "patient.test.js",
            "treatment.test.js",
            "appointment.test.js",
            "medicine.test.js",
            "prescription.test.js"
        ];
    }

    sort(tests) {
        const orderedTests = [];

        for (const fileName of this.order) {
            const testFile = tests.find((test) => test.path.includes(fileName));
            if (testFile) {
                orderedTests.push(testFile);
            }
        }

        return orderedTests;
    }
}

module.exports = CustomTestSequencer;
