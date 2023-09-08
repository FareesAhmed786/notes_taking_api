const router = require('express').Router();
const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} = require("../controllers/notes.controller");
const {verifyToken, authRole} = require("../middlewares/auth");
const {ROLE_ADMIN} = require("../utils/constants");

router.post('', [verifyToken, authRole([ROLE_ADMIN])], createNote)
router.get('/:id', [verifyToken, authRole([ROLE_ADMIN])], getNoteById)
router.get('', [verifyToken, authRole([ROLE_ADMIN])], getNotes)
router.put('/:id', [verifyToken, authRole([ROLE_ADMIN])], updateNote)
router.delete('/:id', [verifyToken, authRole([ROLE_ADMIN])], deleteNote)

module.exports = router;
