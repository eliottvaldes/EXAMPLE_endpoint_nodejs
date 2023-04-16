const verifyFields = require('../middlewares/validateFields');
const verifyJWT = require('../middlewares/validateJWT');
const verifyRoles = require('../middlewares/validateRoles');

module.exports = {
    ...verifyFields,
    ...verifyJWT,
    ...verifyRoles
}