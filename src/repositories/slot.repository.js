const slots = [];

const create = (slot) => {
    slots.push(slot);
    return slot;
};

const findById = (id) => {
    return slots.find(slot => slot.id === id);
};

const findAll = () => {
    return slots;
};

const update = (id, updatedData) => {
    const index = slots.findIndex(slot => slot.id === id);

    if (index === -1) {
        return null;
    }

    slots[index] = {
        ...slots[index],
        ...updatedData
    };

    return slots[index];
};

module.exports = {
    create,
    findById,
    findAll,
    update
};