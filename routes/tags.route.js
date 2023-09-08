const router = require('express').Router();
const {
    getTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag
} = require("../controllers/tags.controller");
const {verifyToken, authRole} = require("../middlewares/auth");
const {ROLE_ADMIN} = require("../utils/constants");

router.post('', [verifyToken, authRole([ROLE_ADMIN])], createTag)
router.get('/:id', [verifyToken, authRole([ROLE_ADMIN])], getTagById)
router.get('', [verifyToken, authRole([ROLE_ADMIN])], getTags)
router.put('/:id', [verifyToken, authRole([ROLE_ADMIN])], updateTag)
router.delete('/:id', [verifyToken, authRole([ROLE_ADMIN])], deleteTag)

module.exports = router;
