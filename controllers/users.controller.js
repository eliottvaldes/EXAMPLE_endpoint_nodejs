const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { Role, User } = require('../models');


const getUsers = async (req = request, res = response) => {
    let { page = 1, limit = 5 } = req.query;

    isNaN(Number(page)) || page < 0 ? page = 1 : page;
    isNaN(Number(limit)) || limit < 0 ? limit = 5 : limit;
    const start = (page - 1) * limit;
    const query = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    const returned = Object.keys(users).length ?? 0;

    res.status(200).json({
        ok: true,
        returned,
        total,
        users
    });
}

const updateUser = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, email, role, google, ...infoUserToUpdate } = req.body;

    if (role) {
        const existRole = await Role.findOne({ role });
        if (!existRole) {
            return res.status(400).json({
                ok: false,
                msg: `The role '${role}' is not valid on db`
            });
        }
        infoUserToUpdate.role = role;
    }

    if (password) {
        const salt = bcryptjs.genSaltSync();
        infoUserToUpdate.password = bcryptjs.hashSync(password, salt);
    }


    const user = await User.findByIdAndUpdate(id, infoUserToUpdate);

    res.status(200).json({
        ok: true,
        user
    });
}

const createUser = async (req = request, res = response) => {

    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(201).json({
        ok: true,
        user
    });
}

const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { state: false });

    res.status(200).json({
        ok: true,
        user
    });
}

module.exports = {
    getUsers,
    updateUser,
    createUser,
    deleteUser
};