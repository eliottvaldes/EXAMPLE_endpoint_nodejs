const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validateFields');
const { search } = require('../controllers/searches.controller');


const router = Router();

const validColections = ['categories', 'products', 'users'];

router.get('/:colection/:term',
    [
        check('colection', 'Colection is required').not().isEmpty(),
        check('colection', `Colection is not valid -> ${validColections}`).isIn(validColections),
        check('term', 'The term is required').not().isEmpty(),
        validateFields
    ],
    search
);

module.exports = router;