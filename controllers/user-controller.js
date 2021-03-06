const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = require("crypto").randomBytes(256).toString("hex");

module.exports = {

    registerUser: (req, res) => {
        var user = new User(req.body);
        user.save(user, (err, newUser) => {
            if (err) {
                console.log('err', err)
                res.status(500).json({ success: false, error: err })
            } else {
                if (newUser) {
                    res.status(200).json({ success: true, user: newUser })
                }
            }
        })
    },

    loginUser: (req, res) => {

        var user = req.body;
        User.findOne({ email: user.email }, (err, foundUSer) => {
            if (err) {
                console.log('err', err)
                res.status(500).json({ success: false, error: err })
            } else {
                if (foundUSer) {
                    let isPasswordValid = foundUSer.comparePassword(foundUSer.password, req.body.password);
                    console.log('isPasswordValid', isPasswordValid)

                    if (isPasswordValid) {
                        const token = jwt.sign({ userId: foundUSer._id }, secret, { expiresIn: '24h' });
                        res.status(200).json({ success: true, message: 'login success', token: token });
                    } else {
                        res.status(500).json({ success: false, message: 'invalid password' });
                    }
                } else {
                    res.status(404).json({ success: false, message: 'user not found' })
                }
            }
        })
    },

}