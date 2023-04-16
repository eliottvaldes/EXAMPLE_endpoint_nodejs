const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Name of category is required'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'State of category is required']
    },

    // we must know who create the category, so we use the user schema
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    }

});

// custom method in modeldb
categorySchema.methods.toJSON = function () {
    const { __v, ...category } = this.toObject();
    return category;
}

module.exports = model('Category', categorySchema);