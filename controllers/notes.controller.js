// noinspection JSCheckFunctionSignatures,JSUnresolvedVariable

const {Note, User} = require("../models");

const whereOption = {
    include: [
        // {
        //     model: NoteBook,
        //     as: "notebook",
        //     attributes: ['title']
        // },
        {
            model: User,
            as: "user",
            attributes: ['username', "email"]
        },
    ],
};

const createNote = (request, response, next) => {
    const note = {
        userUid: request.userId,
        notebookUid: request.body.notebookUid,
        title: request.body.title,
        content: request.body.content,
    };
    Note.create(note)
        .then(data => {
            response.status(201).json({success: true, data: data.toJSON()})
        })
        .catch(err => next(err));
}

const getNotes = (request, response, next) => {
    const fullDetail = request.query.fullDetail ?? false;
    let notebookId = request.query.notebookId ?? null;
    if (notebookId === "") {
        notebookId = null;
    }
    Note.findAll({
        where: {userUid: request.userId, notebookUid: notebookId},
        include: fullDetail ? whereOption.include : null
    }).then(data => {
        response.status(200).json({success: true, data: data.map((d) => d.toJSON())})
    }).catch(err => next(err));
}

const getNoteById = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    Note.findOne({where: {id: uid}, include: whereOption.include})
        .then(data => {
            if (data) {
                response.status(200).json({success: true, data: data.toJSON()})
            } else {
                response.status(404).json({success: false, message: "Note id does not exists."})
            }
        })
        .catch(err => next(err));
}

const updateNote = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    const body = request.body;

    Note.findOne({where: {id: uid}})
        .then(note => {
            if (note) {
                note.update(body, {where: {id: uid}})
                    .then((data) => {
                        response.status(200).json({success: true, data: data.toJSON()})
                    }).catch(err => next(err));
            } else {
                response.status(404).json({success: false, message: "Note id does not exists."})
            }
        })
        .catch(err => next(err));
}

const deleteNote = (request, response, next) => {
    const uid = request.params.id.toString() ?? "";
    Note.findOne({where: {id: uid}})
        .then(note => {
            if (note) {
                Note.destroy({where: {id: uid}})
                    .then(() => {
                        response.status(200).json({success: true, message: "Note deleted."})
                    }).catch(err => next(err));
            } else {
                response.status(404).json({success: false, message: "Note id does not exists."})
            }
        })
        .catch(err => next(err));
}

module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
}