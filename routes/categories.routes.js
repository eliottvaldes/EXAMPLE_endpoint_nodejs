const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    userHasRole
} = require('../middlewares');

const { isCategoryIDValid } = require('../helpers/db-validators');

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories.controller');



const router = Router();

// get -> get all categories -> public
router.get('/', getCategories);

// get -> get category by :id -> public
router.get('/:id',
    [
        check('id', 'ID is required').not().isEmpty(),
        check('id', 'ID is not valid').isMongoId(),
        check('id').custom(isCategoryIDValid),
        validateFields
    ],
    getCategory
);

// post -> create category -> private -> any person with valid tkn
router.post('/',
    [
        validateJWT,
        check('name', 'The category name is required').not().isEmpty(),
        validateFields
    ],
    createCategory
);

// put -> update category by :id-> private -> any person with valid tkn
router.put('/:id',
    [
        validateJWT,
        check('id', 'ID is required').not().isEmpty(),
        check('id', 'ID is not valid').isMongoId(),
        check('id').custom(isCategoryIDValid),
        check('name', 'Category Name is required').not().isEmpty(),
        validateFields
    ],
    updateCategory
);


// delete -> delete category (status: false) by :id -> private -> admin 
router.delete('/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'ID is required').not().isEmpty(),
        check('id', 'ID is not valid').isMongoId(),
        check('id').custom(isCategoryIDValid),
        validateFields
    ],
    deleteCategory
);


module.exports = router;