const express = require('express');
const cors = require('cors');
const dbConnection = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;

        // define the paths for routes
        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            searches:   '/api/search',
            users:      '/api/users',
        }


        this.connectDB();

        this.middlewares();

        this.routes();
    }


    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.searches, require('../routes/searches.routes'));
        this.app.use(this.paths.users, require('../routes/users.routes'));

        // 404 error
        this.app.use('*', (req, res) => {
            res.status(404).json({
                msg: '404 error | Resource not found'
            });
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }

}

module.exports = Server;