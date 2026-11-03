const slotService = require('../services/slot.service');

const createSlot = (req, res, next) => {
    try {
        const slot = slotService.createSlot(req.user, req.body);

        return res.status(201).json({
            success: true,
            data: slot
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSlot
};