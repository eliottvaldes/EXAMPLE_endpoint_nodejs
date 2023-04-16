const { request, response } = require("express");

const { Category } = require('../models');


// getCategories -> paginated, totalRegistered, qntReturned, populate
const getCategories = async (req = request, res = response) => {
    let { page = 1, limit = 5 } = req.query;

    isNaN(Number(page)) || page < 0 ? page = 1 : page;
    isNaN(Number(limit)) || limit < 0 ? limit = 5 : limit;
    const start = (page - 1) * limit;
    const query = { state: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    const returned = Object.keys(categories).length ?? 0;

    res.status(200).json({
        returned,
        total,
        categories
    });

}

// getCategory -> populated{}
const getCategory = async (req = request, res = response) => {

    const { id } = req.params;

    const category = await Category.findById(id)
        .populate('user', 'name');    

    res.status(200).json({
        ok: true,
        category
    });
}

const createCategory = async (req = request, res = response) => {

    const categoryName = req.body.name.toUpperCase();

    // verify if this category exists on db
    const categoryDB = await Category.findOne({ name: categoryName });
    if (categoryDB) {
        return res.status(400).json({
            ok: false,
            msg: `Category ${categoryName} already exists`
        });
    }

    const data = {
        name: categoryName,
        // user obj is created in middleware JWT validation
        user: req.user._id
    }
    // prepare category
    const category = new Category(data);
    // save category on db
    await category.save();


    res.status(201).json({
        ok: true,
        msg: `Category ${categoryName} has created successfully`
    });

}

// updateCategory(name) 
const updateCategory = async (req = request, res = response) => {

    const { id } = req.params;
    const categoryName = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name: categoryName });

    if (categoryDB) {
        return res.status(400).json({
            ok: false,
            msg: `Category ${categoryName} already exists`
        });
    }

    const data = {
        name: categoryName,
        user: req.user._id
    }

    const category = await Category.findByIdAndUpdate(id, data);

    res.status(201).json({
        ok: true,
        category
    });
}

// deleteCategory() ---> state:false
const deleteCategory = async (req = request, res = response) => { 

    const { id } = req.params;

    const data = {
        state: false,
        user: req.user._id
    }

    const category = await Category.findByIdAndUpdate(id, data);

    res.status(200).json({
        ok: true,
        category
    });

}



module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}