const {User} = require('../models/user');

// create a middleware
const authenticate = (req, res, next) => {
  const token = req.header('x-auth');     // takes the value of the header

  // verify the token & fetch the user
  User.findByToken(token).then((user) => {    // invokes the model method findByToken
    if (!user) {
      return Promise.reject();      // sends it directly to catch
    }
    // if promise resolves
    req.user = user;      // adds keys to the request object
    req.token = token;
    next();           // goes back to the route request with updated req

  }).catch((e) => {
    res.status(401).send();     // do not add next() so as not to go to the next statement
  });
};

module.exports = {authenticate};
