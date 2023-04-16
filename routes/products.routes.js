const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    isAdminRole,
} = require('../middlewares');

const { isCategoryIDValid, isProductIDValid } = require('../helpers/db-validators');

const {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');



const router = Router();

// get -> get all products -> public
router.get('/', getProducts);

// get -> get product by :id -> public
router.get('/:id',
    [
        check('id', 'ID is required').not().isEmpty(),
        check('id', 'ID is not valid').isMongoId(),
        check('id').custom(isProductIDValid),
        validateFields
    ],
    getProduct
);

// post -> create product -> private -> any person with valid tkn
router.post('/',
    [
        validateJWT,
        check('name', 'Product name is required').not().isEmpty(),
        check('category', 'Product category is required').not().isEmpty(),
        check('category', 'Category is not valid').isMongoId(),
        check('category').custom(isCategoryIDValid),
        validateFields
    ],
    createProduct
);

// put -> update product by :id-> private -> any person with valid tkn
router.put('/:id',
    [
        validateJWT,
        check('id', 'ID is required').not().isEmpty(),
        check('id', 'ID is not valid').isMongoId(),        
        check('id').custom(isProductIDValid),
        // no validate fields to allow user update product category, name or avaliability
        validateFields
    ],
    updateProduct
);


// delete -> delete product (status: false) by :id -> private -> admin 
router.delete('/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'ID is required').not().isEmpty(),
        check('id', 'ID is not valid').isMongoId(),
        check('id').custom(isProductIDValid),
        validateFields
    ],
    deleteProduct
);


module.exports = router;