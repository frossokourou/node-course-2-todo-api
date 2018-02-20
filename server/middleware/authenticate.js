const {User} = require('../models/user');

// create a middleware
const authenticate = (req, res, next) => {
  // console.log('req', req);
  // console.log('res', res);
  const token = req.header('x-auth');

  // verify the token & fetch the user
  User.findByToken(token).then((user) => {    // invokes the model method
    if (!user) {
      return Promise.reject();      // sends it directly to catch
    }
    // if promise resolves
    console.log(user);
    req.user = user;
    req.token = token;
    next();

  }).catch((e) => {
    res.status(401).send();     // do not add next() so as not to go to the next statement
  });
};

module.exports = {authenticate};
