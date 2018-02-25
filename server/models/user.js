const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);    // returns true or false
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//override the method toJSON() -> determine what gets back when it is converted into a JSON value
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();     // converts user into object

  return _.pick(userObject, ['_id', 'email']);    // must use pick with object
};

// adds an instance method in the UserSchema.methods odject --> you need to invoke it to bind 'this'
UserSchema.methods.generateAuthToken = function () {
  // this keyword stores the individual document 'user'
  const user = this;    // needs to have access to that specific instance (user)
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); // takes the object and the salt secret key and returns token
  user.tokens = [{access, token}];

  return user.save().then(() => {     // returns a promise
    // return token to use in the next then() call (in server.js)
    console.log('user authenticated', {_id: user._id, email: user.email});
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  const user = this;
  // we want to remove any object in the tokens array that has {token: token}
  return user.update({
    $pull: {          // update operator -> removes the whole object
      tokens: {token}
    }
  });
};

// adds a model method in the UserSchema.statics object
UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');  // obj that stores the decoded user id & id creation time
  } catch (e) {
    // return a new promise and call reject()
    return Promise.reject();
  };
  // continue if success
  return User.findOne({     // returns a specific user with these credentials
    _id: decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  });
};
// returns a promise -> if resolved returns a user
UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    // email exists -> check the password
    if (!password) {
      return Promise.reject();    // password is required by user model
    }
    // prefers to return a promise - bcrypt works with callback
    return new Promise((resolve, reject) => {
      // compare passwords
      bcrypt.compare(password, user.password, (error, response) => {
        if (response) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// runs some code before the save event
UserSchema.pre('save', function (next) {
  const user = this;

  // use a mongoose method available on our instance -> isModified
  if (user.isModified('password')) {        // argument is the key to check
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();       // call next() to save user
      });
    });
  } else {    // it was not modified => it was already hashed (don't hash it again)
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
