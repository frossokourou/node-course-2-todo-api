const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const message = 'I am user number 3';
const hash = SHA256(message).toString();

console.log('Message:', message);
console.log(`Hash: ${hash}`);

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
