const { request, response } = require("express");
// library to validate if a value es a valid MongoID
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');


const searchUsers = async (term = '', res = response) => {

    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const user = await User.findById(term);
        return res.status(200).json({
            'ok': true,
            'returned': (user) ? 1 : 0,
            'results': (user) ? [user] : [],
        });
    }


    // craete a regex to search users AVOIDING using sensitive cases
    // using RegExp() that's native from js
    const regex = new RegExp(term, 'i');

    // use or directive in mongodb search to use field 'name' and 'email'
    const users = await User.find({
        // put all conditions inside the array
        $or: [{ name: regex }, { email: regex }],
        // use and to get only active users
        $and: [{ state: true }]
    });


    res.status(200).json({
        'ok': true,
        'returned': Object.keys(users).length ?? 0,
        'results': users
    });

}

const searchCategories = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        // get category and populate the user that create or modify the category
        const category = await Category.findById(term)
            .and({ state: true })
            .populate('user', 'name');

        return res.status(200).json({
            'ok': true,
            'returned': (category) ? 1 : 0,
            'results': (category) ? [category] : [],
        });
    }


    const regex = new RegExp(term, 'i');

    // get category and populate the user that create or modify the category
    const categories = await Category.find({
        $or: [{ name: regex }],
        $and: [{ state: true }]
    })
        .populate('user', 'name');


    res.status(200).json({
        'ok': true,
        'returned': Object.keys(categories).length ?? 0,
        'results': categories
    });
}

const searchProducts = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        // get category and populate the user that create or modify the category
        const product = await Product.findById(term)
            .and({ state: true })
            .populate('category', 'name');

        return res.status(200).json({
            'ok': true,
            'returned': (product) ? 1 : 0,
            'results': (product) ? [product] : [],
        });
    }


    const regex = new RegExp(term, 'i');

    // get category and populate the user that create or modify the category
    const products = await Product.find({
        $or: [{ name: regex }],
        $and: [{ state: true }]
    })
        .populate('category', 'name');


    res.status(200).json({
        'ok': true,
        'returned': Object.keys(products).length ?? 0,
        'results': products
    });
}

const search = (req = request, res = response) => {


    const { colection, term } = req.params;

    switch (colection) {
        case 'users':
            searchUsers(term, res);
            break;

        case 'categories':
            searchCategories(term, res);
            break;

        case 'products':
            searchProducts(term, res);
            break;

        default:

            return res.status(500).json({
                'msg': 'Search forgotted'
            });

            break;
    }



}

module.exports = {
    search
}