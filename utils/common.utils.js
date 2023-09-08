const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkRoles = (roles) => !(roles?.length === 0 || roles?.length === undefined);

// noinspection JSCheckFunctionSignatures
const createJWTToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const errorHandler = (err, code = 500) => {
    let message = err?.errors ? err.errors[0].message : err.message;
    return {
        statusCode: code,
        success: false,
        message,
    };
};

//Hash password
const passwordGen = async (user) => {
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
};

const pretify = (user) => {
    const data = JSON.stringify(user, null, 2);
    return JSON.parse(data);
};

const queryResult = (result) => result;

const queryList = (result) => result.length !== 0;

//Compare the user logged in password with the db user password
async function validatePassword(loginPassword, hashedPassword) {
    return await bcrypt.compare(loginPassword, hashedPassword);
}

const mapRole = ({isUser = true, isAdmin = true,}) => {
    const roles = ["user", "admin"];
    const params = [isUser, isAdmin];

    return roles.filter((role, i) => {
        return params[i].toString() === "true" || params[i] === true;
    });
};

module.exports = {
    checkRoles,
    createJWTToken,
    errorHandler,
    passwordGen,
    pretify,
    queryList,
    queryResult,
    validatePassword,
    mapRole,
};
