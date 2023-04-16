const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {
        // the data we want to save inside the jwt
        const payload = { uid };

        jwt.sign(payload, process.env.SECRET_JWT_KEY, {
            expiresIn: '6h'
        }, (err,token) => {
            if(err){
                console.log(err);
                reject('The token could not be generated');
            }else{
                resolve(token);
            }
        }
        );

    });

}

module.exports = {
    generateJWT
}