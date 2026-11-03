const express = require('express');

const router = express.Router();

const {
    authenticateUser,
    authorizeRoles
} = require('../middlewares/auth.middleware');

const slotController = require('../controllers/slot.controller');

router.post(
    '/',
    authenticateUser,
    authorizeRoles('recruiter'),
    slotController.createSlot
);

module.exports = router;