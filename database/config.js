const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Db successfully connected');

    } catch (error) {
        console.error('Error connection db', error);
        throw new Error('Error in db connection');
    }

}

module.exports = dbConnection;