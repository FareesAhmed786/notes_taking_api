// noinspection JSUnresolvedVariable

function errorLogger(error, req, res, next) {
    console.error(error)
    if (error.name === "SequelizeUniqueConstraintError") {
        if (error.errors[0].message === "email must be unique") {
            res.status(226).json({success: false, message: "email already exists."})
        } else if (error.errors[0].message === "medicineName must be unique") {
            res.status(226).json({success: false, message: "medicine name already exists."})
        } else {
            console.error(error)
            next(error)
        }
    } else if (error.name === "SequelizeDatabaseError") {
        if (error.parent.routine === 'string_to_uuid') {
            res.status(400).json({success: false, message: "Invalid ID."})
        } else if (error.parent.routine === 'pg_strtoint32') {
            res.status(400).json({success: false, message: "Invalid Phone number."})
        }
    }
    else if (error.name === "SequelizeForeignKeyConstraintError") {
        res.status(404).json({success: false, message: "PatientID, DoctorID, or TreatmentID does not exists."})
    }
    else if (error.code === "22P02") {
        res.status(404).json({success: false, message: "ID does not exists."})
    }
    else {
        console.error(error)
        next(error)
    }
}

function failSafeHandler(error, req, res, _) { // generic handler
    res.status(500).json({success: false, error: "server error"})
}

module.exports = {
    errorLogger: errorLogger,
    failSafeHandler: failSafeHandler,
}
