const { response } = require('express');

const isAdminRole = (req, res = response, next) => {
    const user = req.user;
    if (!user) {
        return res.status(500).json({
            ok: false,
            msg: 'User auth is not set -> veify the JWT Validation'
        });
    }

    if (user.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            msg: `User '${user.name}' is not allowed to execute this action`
        });
    }

    next();

}


const userHasRole = (...roles) => {

    return (req, res = response, next) => {
        const user = req.user;
        if (!user) {
            return res.status(500).json({
                ok: false,
                msg: 'User auth is not set -> veify the JWT Validation'
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(401).json({
                ok: false,
                msg: `User does not has some of the required roles: ${roles}`
            });
        }

        next();

    }

}

module.exports = {
    isAdminRole,
    userHasRole
}