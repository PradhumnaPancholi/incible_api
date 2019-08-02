const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const router = express.Router()

//to register user//
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password} = req.body
    //look if user email already exists//
    User.findOne(req.body.email, (err, user) => {
        //if user already exists, send msg//
        if(user) {
            res.json({msg: "User already exists!!!"})
            return
        }
        //password validations//
        if(password === ""){
            //password can't be empty//
            res.json({msg:"Password can't be empty"})
        }else{
            //create new user object//
            let user = new User({
                firstName,
                lastName,
                email,
                password,
                joinedOn: Date.now()
            })

            //hashing the password//
            bcrypt.hash(user.password, 10, (err, hashedPassword) => {
                if(err){
                    res.status(500).json({msg: err})
                }else{
                    //store hashed password//
                    user.password = hashedPassword
                    user.save()
                    res.json(user)
                }
            })
        }


    })
})
//to login user//
router.post('/login', (req, res) => {
    //to find user by email//
    User.findOne({email: req.body.email}, (err, user) => {
        //throw error if user not found//
        if(err){
            res.status(500).json({msg: "User not found"})
        }else{
            //compare entered password with stores hash//
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                //if not similar to hash, throw error//
                if(err){
                    res.status(401).json({msg: "Authentication failed: Incorrect password"}) 
                }
                //if given password is similar to hash, generate token show success//
                if(result){
                    const auth_token = jwt.sign({
                            email: user.email,
                            userID: user.id
                        }, keys.JWT_KEY,
                        {
                            expiresIn: '5h'
                        }
                    )
                    res.status(200).json({
                        msg: "Authentication successful",
                        token: auth_token
                    })
                }
            })

        }
    })
})

//Read route - to get all users//
router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json(allUsers)
        }
    })
})

//Details route - to get user by ID//
router.get('/:id', (req, res) => {
    User.findOne({_id: req.params.id}, (err, foundUser) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json(foundUser)
        }
    })
})

//Edit route - to edit existing user information//
router.put('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.status(500).json(err)
        }else{
            //currently this route just allows user to edit their first and last name//
            user.firstName = req.body.firstName,
            user.lastName = req.body.lastName

            user.save((err, updatedUser) => {
                if(err){
                    res.status(500).json(err)
                }else{
                    res.status(200).json(updatedUser)
                }
            })
        }
    })
})

//Delete route - to delete a user//
router.delete('/:id', (req, res) => {
    User.deleteOne({_id: req.params.id}, (err) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json({msg: "User deleted succesfully"})
        }
    })
})

module.exports = router