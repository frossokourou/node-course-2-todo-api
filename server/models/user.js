const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

//override the method toJSON() -> determines what gets back when it is converted into a JSON value
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
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens = [{access, token}];

  return user.save().then(() => {
    // return token to use in the next then() call (in server.js)
    console.log(user);
    return token;
  });
};

// adds a model method in the UserSchema.statics object
UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');  // obj that stores the decoded user id & id creation time
  } catch (e) {
    // return a new promise that fails
    return Promise.reject();
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
  };
  // continue if success
  return User.findOne({     // returns a specific user
    _id: decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
