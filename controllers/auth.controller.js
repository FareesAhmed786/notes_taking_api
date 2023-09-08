// noinspection JSUnresolvedFunction,JSUnresolvedVariable,JSCheckFunctionSignatures

const {errorHandler, checkRoles, queryResult, validatePassword, queryList, mapRole} = require("../utils/common.utils");
const {User, Role, Token} = require("../models");

const register = async (req, res) => {
    try {
        const {roles, username, email, password} = req.body;
        if (!checkRoles(roles)) {
            return res.status(200).json(errorHandler({message: "Please provide the roles key!!"}));
        }
        const [role, _created] = await Role.findOrCreate({where: {name: roles[0]}});
        if (!queryResult(role)) {
            return res.status(200).json(errorHandler({message: "Role doesn't exits!"}));
        }
        const user = await User.create({username, email, password});

        //Assign Roles
        await user.addRoles([role]);
        return res.status(201).json({success: true, data: user,});
    } catch (err) {
        return res.status(200).json(errorHandler(err));
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({
            where: {email},
            include: {
                model: Role,
                attributes: ["name"],
                as: "roles",
                through: {
                    attributes: [],
                },
            },
        });
        if (!queryResult(user)) {
            return res.status(200).json(errorHandler({message: "user doesn't exists!!"}));
        }

        //Compare the login password using hash.compare
        const passCheck = await validatePassword(password, user.password);
        if (!passCheck) {
            return res.status(200).json(errorHandler({message: "Invalid password!!"}));
        }

        //Generate access token.
        const userToken = await user.tokenGen();
        //Successful sign in
        return res.status(200).json({
            success: true,
            data: {
                user,
                accessToken: userToken?.token,
            },
        });
    } catch (err) {
        return res.status(200).send(errorHandler(err));
    }
};

const logout = async (req, res) => {
    try {
        const {userId} = req;
        const token = await Token.destroy({where: {user_id: userId}});

        if (!queryResult(token)) {
            return res.status(200).json(errorHandler({message: "Something went wrong while logging out!"}));
        }
        return res.json({success: true, data: {message: "successfully logged out!"}});
    } catch (err) {
        return res.status(200).send(errorHandler(err));
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        if (req.body.roles) {
            return res.status(200).json(errorHandler({message: "Roles can't be updated!!"}));
        }
        const user = await User.update(
            {...req.body,},
            {where: {id}, individualHooks: true,}
        );
        if (!queryList(user[1])) {
            return res.status(200).json(errorHandler({message: "user id doesn't exists!!"}));
        }

        return res.json({
            success: true,
            data: {user: user[1][0]},
        });
    } catch (err) {
        return res.status(200).send(errorHandler(err));
    }
};

const checkAuth = async (req, res) => {
    try {
        if (req?.user) {
            return res.send({success: true, data: {isAuthorized: true}});
        } else {
            return res.status(200).json(errorHandler({message: "Unauthorized, Token doesn't match!!"}, 401));
        }
    } catch (err) {
        return res.status(200).send(errorHandler(err, 401));
    }
};

const getUsers = async (req, res) => {
    try {
        //Custom api, fetch based on roles
        const {isUser, isAdmin} = req?.query;

        let users;

        if (isUser || isAdmin) {
            const roles = mapRole(req?.query);
            users = await User.findAll({
                include: [
                    {
                        model: Role,
                        as: "roles",
                        attributes: ["name"],
                        through: {attributes: []},
                        where: {name: roles},
                    },
                ],
            });
        } else {
            users = await User.findAll({
                include: [
                    {
                        model: Role,
                        as: "roles",
                        attributes: ["name"],
                        through: {attributes: []},
                    },
                    {
                        model: Token,
                        as: "tokens",
                        attributes: ["token"],
                    },
                ],
            });
        }

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (err) {
        return res.status(200).send(errorHandler(err));
    }
};

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);

        if (!queryResult(user)) {
            return res.status(200).send({success: false, message: "User Doesn't exists!"});
        }
        await user.setRoles([]);
        await user.destroy();
        return res.status(200).json({success: true, message: "User successfully deleted!",});
    } catch (err) {
        return res.status(200).send(errorHandler(err));
    }
};

module.exports = {
    register,
    login,
    logout,
    update,
    checkAuth,
    getUsers,
    deleteUser,
};
