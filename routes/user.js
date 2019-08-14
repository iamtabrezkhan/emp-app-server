const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
    res.send('user root...');
})

// Create user route ============================

router.post('/create', async (req, res, next) => {
    let user = await User.findOne({email: req.body.email});
    console.log(user);
    if(user) {
        return res.json({
            success: false,
            error: 'Email already exists!'
        })
    }
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        department: req.body.department,
        created: req.body.created
    });
    newUser.createUser(newUser, (err, user) => {
        if(err) throw err;
        return res.json({
            success: true,
            message: 'Account created!',
            user: user
        })
    })
})
// ==============================================

// Authenticate user route ============================

router.post('/auth', async (req, res, next) => {
    User.findOne({email: req.body.email}, 'password name email phone department', (err, user) => {
        if(err) {
            throw err;
            return res.json({
                success: false,
                error: 'Something went wrong!'
            })
        };
        // if user email exists, then proceed
        if(user) {
            // Compare user password with the hash saved in the DB ==============
            console.log(req.body.password);
            console.log(user.password);
            User.comparePassword(req.body.password, user.password, (err, didMatch) => {
                if(err) {
                    throw err;
                    return res.json({
                        success: false,
                        error: 'Something went wrong!'
                    })
                };
                if(didMatch) {
                    let token = jwt.sign({
                        name: user.name,
                        department: user.department
                    }, 'iambatman', {
                        expiresIn: '6h'
                    });
                    user.password = undefined;
                    return res.json({
                        success: true,
                        message: 'Login successful',
                        user: user,
                        accessToken: token
                    });
                } else {
                    return res.json({
                        success: false,
                        error: 'Hmm, incorrect password!'
                    })
                }
            })
        } else {
            // user email doest not exist
            return res.json({
                success: false,
                error: 'Email does not exist!'
            })
        }
    })
})
// ==============================================

// Get all the users ============================

router.post('/getall', (req, res, next) => {
    var userId = req.body.userId;
    User.find({_id: {$ne: userId}}, (err, users) => {
        if(err) throw err;
        return res.json({
            success: true,
            users: users
        });
    })
})

// Get single user ==============================

router.post('/getone', async (req, res, next) => {
    var userId = req.body.userId;
    var requestedUserId = req.body.requestedUserId;
    try {
        var requestedUser = await User.findById(requestedUserId);
    } catch (error) {
        return res.json({
            success: false,
            error: 'Requested user not found'
        })
    }
    if(requestedUser) {
        try {
            var user = await User.findById(userId);
        } catch (error) {
            return res.json({
                success: false,
                error: 'Requesting user not found'
            })
        }
        if(!user) {
            return res.json({
                success: false,
                error: 'Requesting user not found'
            })
        }
        if(user.department === requestedUser.department) {
            return res.json({
                success: true,
                user: requestedUser
            });
        } else {
            return res.json({
                success: false,
                error: 'Department does not match'
            })
        }
    } else {
        console.log('x');
        return res.json({
            success: false,
            error: 'User not found'
        })
    }
})

module.exports = router;