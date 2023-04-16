const { Schema, model } = require('mongoose');

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name of product is required'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'State of product is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    price: {
        type: Number,
        default: 0
    },
    // reference to the category
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    avaliable: {
        type: Boolean,
        default: true,
        required: true,
    }

});

// custom method in modeldb
productSchema.methods.toJSON = function () {
    const { state, __v, ...product } = this.toObject();
    return product;
}

module.exports = model('Product', productSchema);