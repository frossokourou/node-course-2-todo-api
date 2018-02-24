const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

// generate a salt (rounds, callback) --> needs time to generate salt (10 rounds)
bcrypt.genSalt(10, (err, salt) => {
  // hash the password
  bcrypt.hash(password, salt, (err, hash) => {
    console.log('hashedPassword:', hash);
  });
});

const hashedPassword = '$2a$10$mYClcmnZ0dFGG3kMGpVUBecTNcHDN0bGs8WeCs4YK8A332R.4Xqhq';

//check if given password is correct
// bcrypt.compare(password, hashedPassword, (err, res) => {
//   console.log(res);     // prints true
// });

bcrypt.compare('123!', hashedPassword, (err, res) => {
  console.log(res);     // prints false
});

// const message = 'I am user number 3';
// const hash = SHA256(message).toString();
//
// console.log('Message:', message);
// console.log(`Hash: ${hash}`);

const data = {
  id: 4
};
// takes the object and the secret
const token = jwt.sign(data, '123abc');
console.log('token:', token);

// checks that the token is valid and that the secret key is the same
const decoded = jwt.verify(token, '123abc');
console.log('decoded:', decoded);

// SHA256('String')
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'someSecret').toString()       // adding 'salt' to the string
// };

// try to change the data and re-hash
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// // check if data is altered
// const resultHash = SHA256(JSON.stringify(token.data) + 'someSecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed');
// }
