const { Role, User, Category, Product } = require('../models');


const isRoleValid = async (role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`The role '${role}' is not valid on db`);
    }
}

const isEmailRegistered = async (email = '') => {
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        throw new Error(`The email '${email} is already registered, try another`);
    }
}

const isIDValid = async (id) => {
    const existID = await User.findById(id);
    if (!existID) {
        throw new Error(`The ID: ${id} doesn't exist in the db`);
    }
}

const isCategoryIDValid = async (id) => {
    const existCategoryID = await Category.findById(id);

    if (!existCategoryID) {
        throw new Error(`The Category ID: ${id} doesn't exist in the db`);
    }

    if (!existCategoryID.state) {
        throw new Error(`The Category ID: ${id} is not available - it's been deleted`);
    }

}
const isProductIDValid = async (id) => {
    const existProductID = await Product.findById(id);

    if (!existProductID) {
        throw new Error(`The Product ID: ${id} doesn't exist in the db`);
    }

    if (!existProductID.state) {
        throw new Error(`The Product ID: ${id} is not valid - it's been deleted`);
    }

}




module.exports = {
    isRoleValid,
    isEmailRegistered,
    isIDValid,
    isCategoryIDValid,
    isProductIDValid,
}