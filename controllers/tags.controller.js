// noinspection JSCheckFunctionSignatures,JSUnresolvedVariable

const {Tag, User} = require("../models");

const whereOption = {
    include: [
        {
            model: User,
            as: "user",
            attributes: ['username', "email"]
        },
    ],
};

const createTag = (request, response, next) => {
    const tag = {
        userUid: request.userId,
        title: request.body.title,
    };
    Tag.create(tag)
        .then(data => {
            response.status(201).json({success: true, data: data.toJSON()})
        })
        .catch(err => next(err));
}

const getTags = (request, response, next) => {
    const fullDetail = request.query.fullDetail ?? false
    Tag.findAll({
        where: {userUid: request.userId},
        include: fullDetail ? whereOption.include : null
    }).then(data => {
        response.status(200).json({success: true, data: data.map((d) => d.toJSON())})
    }).catch(err => next(err));
}

const getTagById = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    Tag.findOne({where: {id: uid}, include: whereOption.include})
        .then(data => {
            if (data) {
                response.status(200).json({success: true, data: data.toJSON()})
            } else {
                response.status(404).json({success: false, message: "Tag id does not exists."})
            }
        })
        .catch(err => next(err));
}

const updateTag = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    const body = request.body;

    Tag.findOne({where: {id: uid}})
        .then(tag => {
            if (tag) {
                tag.update(body, {where: {id: uid}})
                    .then((data) => {
                        response.status(200).json({success: true, data: data.toJSON()})
                    }).catch(err => next(err));
            } else {
                response.status(404).json({success: false, message: "Tag id does not exists."})
            }
        })
        .catch(err => next(err));
}

const deleteTag = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    Tag.findOne({where: {id: uid}})
        .then(tag => {
            if (tag) {
                Tag.destroy({where: {id: uid}})
                    .then(() => {
                        response.status(200).json({success: true, message: "Tag deleted."})
                    }).catch(err => next(err));
            } else {
                response.status(404).json({success: false, message: "Tag id does not exists."})
            }
        })
        .catch(err => next(err));
}

module.exports = {
    getTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
}