const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req = request, res = response) => {


    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                msg: 'User or Password are incorrect - email'
            });
        }

        if(!user.state){
            return res.status(400).json({
                msg: 'User or Password are incorrect - state:false'
            });
        }


        const isValidPassword = bcryptjs.compareSync(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({
                msg: 'User or Password are incorrect - password'
            });
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token
        });

    } catch (err) {
        res.status(500).json({
            msg: 'Something wnet wrong!'
        });
    }



}


const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { name, email, avatar } = await googleVerify(id_token);

        let user = await User.findOne({email});

        // if user no exist in our db, we create
        if (!user) {
            const dataUser = {
                name,
                email,
                password: ':3',
                img: avatar,
                role: 'USER_ROLE',
                google: true
            }
            user = new User(dataUser);
            await user.save();
        }

        // if user has false state in our db
        if (!user.state) {
            return res.status(401).json({
                msg: 'User is blocked and not able to access'
            });
        }

        // generate the jwt based on user _id
        const token = await generateJWT(user.id);
        
        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token could not be verified'
        });
    }

    

}


module.exports = {
    login,
    googleSignIn
}