const { Router } = require('express');
const { check } = require('express-validator');

const { isRoleValid, isEmailRegistered, isIDValid } = require('../helpers/db-validators');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    userHasRole
} = require('../middlewares');

const {
    getUsers,
    updateUser,
    createUser,
    deleteUser
} = require('../controllers/users.controller');

const router = Router();

// Define all users-routes

router.get('/all', getUsers);

router.put('/update/:id',
    [
        check('id', 'The ID is not valid').isMongoId(),
        check('id').custom(isIDValid),
        validateFields
    ],
    updateUser
);

router.post('/new/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('email').custom(isEmailRegistered),
        check('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 }),
        check('role').custom(isRoleValid),
        validateFields
    ],
    createUser
);

router.delete('/delete/:id',
    [
        validateJWT,
        // isAdminRole, //middleware to validate if the user.role is strictly an 'ADMIN_ROLE'
        userHasRole('SELLER_ROLE', 'INVENTED_ROLE'), // middleware to validate any role especified in params
        check('id', 'The ID is not valid').isMongoId(),
        check('id').custom(isIDValid),
        validateFields
    ],
    deleteUser
);

module.exports = router;