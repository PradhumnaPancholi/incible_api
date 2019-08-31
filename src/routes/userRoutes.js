/* eslint-disable no-param-reassign */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const keys = require("../config/keys");
const isLoggedIn = require("../middlewares/isLoggedIn");
const checkSpecialCharacter = require("../utils/helper.functions");

const router = express.Router();

// to register user//
router.post("/register", (req, res) => {
  const {
    firstName, lastName, email, password, accountType,
  } = req.body;
  // look if user email already exists//
  User.findOne({ email: req.body.email }, (error, user) => {
    // if user already exists, send msg//
    if (user) {
      res.status(500).json({ msg: "User already exists!!!" });
    } else if (error) {
      res.status(500).json({ msg: error });
      // for passoword validation//
      // password can't be empty//
    } else if (password === "") {
      res.status(500).json({ msg: "Password can't be empty" });
      // password cannot be less than 8 characters//
    } else if (password.length < 8) {
      res.status(500).json({ msg: "password must be atleast 8 characters" });
      // for checking if user have special characters in password //
    } else if (checkSpecialCharacter(password) === false) {
      res.status(500).json({ msg: "password should have atleast one special character" });
    } else {
      // create new user object//
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        accountType,
        joinedOn: Date.now(),
        accountStatus: "Active", // Always default value//
      });

      // hashing the password//
      // eslint-disable-next-line no-shadow
      bcrypt.hash(newUser.password, 10, (error, hashedPassword) => {
        if (error) {
          res.status(500).json({ msg: error });
        } else {
          // store hashed password//
          newUser.password = hashedPassword;
          newUser.save();
          res.status(200).json(newUser);
        }
      });
    }
  });
});

// to login user//
router.post("/login", (req, res) => {
  // to find user by email//
  User.findOne({ email: req.body.email }, (err, user) => {
    // throw error if user not found//
    if (err) {
      res.status(409).json({ msg: err });
    } else if (!user) {
      res.status(300).json({ msg: "User nor found" });
    } else {
      // compare entered password with stores hash//
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        // if not similar to hash, throw error//
        if (error) {
          res.status(401).json({ msg: "Authentication failed: Incorrect password" });
        }
        // if given password is similar to hash, generate token show success//
        if (result) {
          const authToken = jwt.sign({
            email: user.email,
            userID: user.id,
          }, keys.JWT_KEY,
          {
            expiresIn: "5h",
          });
          res.status(200).json({
            msg: "Authentication successful",
            token: authToken,
          });
        }
      });
    }
  });
});

// Read route - to get all users//
router.get("/", (req, res) => {
  User.find({}, (err, allUsers) => {
    if (err) {
      res.status(409).json(err);
    } else {
      res.status(200).json(allUsers);
    }
  });
});

// Details route - to get user by ID//
router.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (error, foundUser) => {
    if (error) {
      res.status(409).json(error);
    } else {
      res.status(200).json(foundUser);
    }
  });
});

// Profile route //
router.get("/me", isLoggedIn, (req, res) => {
  const id = req.userData.userID;
  User.findOne({ _id: id }, (error, foundUser) => {
    if (error) {
      res.status(409).json(error);
    } else {
      // eslint-disable-next-line no-unused-vars
      const userDto = Object.assign(foundUser, { password: undefined });
      res.status(200).json(foundUser);
    }
  });
});

// Edit route - to edit existing user information//
router.put("/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      res.status(409).json(err);
    } else {
      // currently this route just allows user to edit their first and last name//
      foundUser.firstName = req.body.firstName;
      foundUser.lastName = req.body.lastName;

      foundUser.save((error, updatedUser) => {
        if (error) {
          res.status(409).json(error);
        } else {
          res.status(200).json(updatedUser);
        }
      });
    }
  });
});

// Delete route - to delete a user//
router.delete("/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(409).json(err);
    } else {
      res.status(200).json({ msg: "User deleted succesfully" });
    }
  });
});

module.exports = router;
