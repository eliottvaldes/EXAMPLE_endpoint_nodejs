const { request, response } = require("express");
const { Product } = require("../models");

const getProducts = async (req = request, res = response) => {
    let { page = 1, limit = 5 } = req.query;

    isNaN(Number(page)) || page < 0 ? page = 1 : page;
    isNaN(Number(limit)) || limit < 0 ? limit = 5 : limit;
    const start = (page - 1) * limit;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    const returned = Object.keys(products).length ?? 0;

    res.status(200).json({
        returned,
        total,
        products
    });
}

const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.status(200).json({
        ok: true,
        product
    });
}

const createProduct = async (req = request, res = response) => {

    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();

    // verify if this product exists on db
    const productDB = await Product.findOne({ name: data.name });
    if (productDB) {
        return res.status(400).json({
            ok: false,
            msg: `Product '${productDB.name}' already exists`
        });
    }

    data.user = req.user._id

    // prepare product
    const product = new Product(data);

    // save product on db
    await product.save();


    res.status(201).json({
        ok: true,
        msg: `Product '${product.name}' has created successfully`,
    });
}

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (!data || Object.keys(data).length == 0) {
        return res.status(200).json({
            ok: true,
            msg: `No changes was made`
        });
    }

    if (data.name) {
        data.name = data.name.toUpperCase();
        const productDB = await Product.findOne({ name: data.name });
        if (productDB) {
            return res.status(400).json({
                ok: false,
                msg: `Product ${productDB.name} already exists`
            });
        }
    }


    if(data.category){
        try {
            const existCategoryID = await Category.findById(data.category);     
            if(!existCategoryID){
                return res.status(400).json({
                    ok: false,
                    msg: `Category ID is not valid - not id found`
                });
            }       
        } catch (error) {
            return res.status(400).json({
                ok: false,
                msg: `Category ID is not valid - not id found`
            });
        }

    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
        ok: true,
        product
    });
}


const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const data = {
        state: false,
        user: req.user._id
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        ok: true,
        product
    });
}


module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}