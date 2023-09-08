// noinspection JSCheckFunctionSignatures,JSUnresolvedVariable

const {Notebook, Note, User} = require("../models");

const whereOption = {
    include: [
        {
            model: Note,
            as: "notes",
            attributes: ['title', "content"]
        },
        {
            model: User,
            as: "user",
            attributes: ['username', "email"]
        },
    ],
};

const createNotebook = (request, response, next) => {
    const notebook = {
        userUid: request.userId,
        title: request.body.title,
    };
    Notebook.create(notebook)
        .then(data => {
            response.status(201).json({success: true, data: data.toJSON()})
        })
        .catch(err => next(err));
}

const getNotebooks = (request, response, next) => {
    const fullDetail = request.query.fullDetail ?? false
    let uid = request.userId;
    console.log(uid);
    Notebook.findAll({
        where: {userUid: uid},
        include: fullDetail ? whereOption.include : null
    }).then(data => {
        response.status(200).json({success: true, data: data.map((d) => d.toJSON())})
    }).catch(err => next(err));
}

const getNotebookById = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    Notebook.findOne({where: {id: uid}, include: whereOption.include})
        .then(data => {
            if (data) {
                response.status(200).json({success: true, data: data.toJSON()})
            } else {
                response.status(404).json({success: false, message: "Notebook id does not exists."})
            }
        })
        .catch(err => next(err));
}

const updateNotebook = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    const body = request.body;

    Notebook.findOne({where: {id: uid}})
        .then(notebook => {
            if (notebook) {
                notebook.update(body, {where: {id: uid}})
                    .then((data) => {
                        response.status(200).json({success: true, data: data.toJSON()})
                    }).catch(err => next(err));
            } else {
                response.status(404).json({success: false, message: "Notebook id does not exists."})
            }
        })
        .catch(err => next(err));
}

const deleteNotebook = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    Notebook.findOne({
        where: {id: uid},
        include: [
            {
                model: Note,
                as: "notes",
            },
        ]
    }).then(notebook => {
        if (notebook) {
            notebook.setNotes([]);
            Note.destroy({where: {notebookUid: uid},}).then(_ => {
                Notebook.destroy({
                    where: {id: uid},
                }).then(() => {
                    response.status(200).json({success: true, message: "Notebook deleted."})
                })
            }).catch(err => next(err));
        } else {
            response.status(404).json({success: false, message: "Notebook id does not exists."})
        }
    })
        .catch(err => next(err));
}

module.exports = {
    getNotebooks,
    getNotebookById,
    createNotebook,
    updateNotebook,
    deleteNotebook,
}
