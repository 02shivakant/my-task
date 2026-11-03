const slotRepository = require('../repositories/slot.repository');
const { randomUUID } = require('crypto');

const createSlot = (user, data) => {
    const { startsAt, durationMinutes } = data;

    // Validate required fields
    if (!startsAt || durationMinutes === undefined) {
        const error = new Error('startsAt and durationMinutes are required');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        throw error;
    }

    // Validate ISO date-time
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

    if (typeof startsAt !== 'string' || !isoRegex.test(startsAt)) {
        const error = new Error('startsAt must be a valid ISO 8601 date-time');
        error.statusCode = 400;
        error.code = 'INVALID_DATE';
        throw error;
    }

    const startTime = new Date(startsAt);

    if (Number.isNaN(startTime.getTime())) {
        const error = new Error('Invalid start date');
        error.statusCode = 400;
        error.code = 'INVALID_DATE';
        throw error;
    }

    // Validate future date
    if (startTime.getTime() <= Date.now()) {
        const error = new Error('Interview slot must be in the future');
        error.statusCode = 400;
        error.code = 'PAST_DATE';
        throw error;
    }

    // Validate duration
    if (
        !Number.isInteger(durationMinutes) ||
        durationMinutes < 15 ||
        durationMinutes > 120
    ) {
        const error = new Error('Duration must be between 15 and 120 minutes');
        error.statusCode = 400;
        error.code = 'INVALID_DURATION';
        throw error;
    }

    const newStart = startTime.getTime();
    const newEnd = newStart + durationMinutes * 60 * 1000;

    // Check overlapping slots
    const existingSlots = slotRepository.findAll();

    const hasOverlap = existingSlots.some(slot => {
        if (
            slot.recruiterId !== user.id ||
            slot.status === 'cancelled'
        ) {
            return false;
        }

        const existingStart = new Date(slot.startsAt).getTime();

        const existingEnd =
            existingStart + slot.durationMinutes * 60 * 1000;

        return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasOverlap) {
        const error = new Error('You already have an overlapping slot');
        error.statusCode = 409;
        error.code = 'SLOT_OVERLAP';
        throw error;
    }

    // Create slot
    const slot = {
        id: randomUUID(),
        recruiterId: user.id,
        startsAt: startTime.toISOString(),
        durationMinutes,
        status: 'open',
        candidateId: null,
        createdAt: new Date().toISOString()
    };

    return slotRepository.create(slot);
};

module.exports = {
    createSlot
};