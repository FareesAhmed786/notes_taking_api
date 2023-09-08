// noinspection JSCheckFunctionSignatures,ExceptionCaughtLocallyJS

const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const {User, Role, Token} = require("../models");
const {errorHandler, pretify} = require("../utils/common.utils");


const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7, authHeader.length);
            if (!token) {
                const err = {
                    message: "No token provided!!",
                };
                return res.send(errorHandler(err, 401));
            }

            //Verify the token using the jwt secret.
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    const temp = {
                        message: "Unauthorized, Token doesn't match!!",
                    };
                    return res.send(errorHandler(temp, 401));
                }

                const user = await User.findOne({
                    where: {
                        id: decoded.id,
                    },
                    include: [
                        {
                            model: Role,
                            as: "roles",
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: Token,
                            as: "tokens",
                            where: {
                                token: {
                                    [Op.eq]: token,
                                },
                            },
                        },
                    ],
                });

                if (user?.tokens.length === 0 || !user) {
                    const err = {
                        message: "Unauthorized, User Doesn't exists!!",
                    };
                    return res.send(errorHandler(err, 401));
                }

                req.userId = decoded.id;
                req.user = user;
                next();
            });
        } else {
            const err = {
                message: "Unauthorized, please use Bearer <token> format.",
            };
            return res.send(errorHandler(err, 401));
        }
    } catch (err) {
        return res.status(500).send({
            err: err?.message,
            location: "auth.js | verifyToken",
        });
    }
};

const authRole = (rolesArray) => async (req, res, next) => {
    try {
        const id = req.userId;

        if (!id) {
            throw {
                message: "Session expired, id not found!, login again",
            };
        }

        const user = req.user;

        //Destructure the role, for comparing
        const {roles, ...userData} = pretify(user);

        //At-least one the role must match against the role included in rolesArray
        const roleCheck = roles.some((role) => rolesArray.includes(role.name));

        //If true, call next()
        if (roleCheck || rolesArray.length === 0) {
            req.user = userData;
            next();
        } else {
            throw {
                message: "Role level doesn't match!!",
            };
        }
    } catch (err) {
        console.log("Something went wrong in auth.js | authRole");

        return res.send(errorHandler(err, 401));
    }
};

module.exports = {
    verifyToken,
    authRole,
};
