const { response, request } = ('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token found in req'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY)

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Token not valid -> User does not exist in db'
            });
        }

        if (!user.state) {
            return res.status(401).json({
                ok: false,
                msg: 'Token not valid -> User.state: false'
            });
        }

        req.user = user;
        next();

    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token is not valid'
        });

    }

}

module.exports = {
    validateJWT
}