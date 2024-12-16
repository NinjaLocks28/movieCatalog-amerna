const bcrypt = require('bcrypt')
const User = require('../models/User');
const auth = require('../auth')
const { errorHandler } = require('../auth')


module.exports.registerUser = async (req, res) => {
    try {
        
        const { email, password, mobileNo } = req.body
        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(409).send({
                message: 'Duplicate email found'
            })
        }

        if(!email.includes("@")) {
            return res.status(400).send({
                message: 'Email invalid'
            })
        }

        if(mobileNo.length !== 11) {
            return res.status(400).send({
                message: 'Mobile number invalid'
            })
        }

        if(password.length < 8) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            password: hashedPassword,
            mobileNo
        })

        await newUser.save()

        return res.status(200).send({
            message: 'Registered Successfully'
        })

    }
    catch (err) {
        errorHandler (err, req, res)
    }
}



module.exports.loginUser = async (req, res) => {
    
    try {

        const { email, password } = req.body;

        if(!email.includes("@")) {
            return res.status(400).send({
                message: 'Email invalid'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({
                message: 'No Email found'
            })
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password)

        if(isPasswordCorrect) {
            const accessToken = auth.createAccessToken(user);
            return res.status(201).send({
                access: accessToken
            })
        } else {
            return res.status(401).send({
                message: 'Email and password do not match'
            })
        }
    } 
    catch (err) {
        errorHandler (err, req, res)
    }
}