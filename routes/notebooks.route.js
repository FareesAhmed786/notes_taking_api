const router = require('express').Router();
const {
    getNotebooks,
    getNotebookById,
    createNotebook,
    updateNotebook,
    deleteNotebook
} = require("../controllers/notebooks.controller");
const {verifyToken, authRole} = require("../middlewares/auth");
const {ROLE_ADMIN} = require("../utils/constants");

router.post('', [verifyToken, authRole([ROLE_ADMIN])], createNotebook)
router.get('/:id', [verifyToken, authRole([ROLE_ADMIN])], getNotebookById)
router.get('', [verifyToken, authRole([ROLE_ADMIN])], getNotebooks)
router.put('/:id', [verifyToken, authRole([ROLE_ADMIN])], updateNotebook)
router.delete('/:id', [verifyToken, authRole([ROLE_ADMIN])], deleteNotebook)

module.exports = router;
