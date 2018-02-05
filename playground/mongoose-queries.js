const {ObjectID} =require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// const id = '5a78cb843f1c303449c406d0';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }
//
// Todo.find({
//   _id: id         // mongoose converts it into ID object
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({        // returns the first that matches the criteria or null
//   _id: id
// }).then((todo) => {
//   console.log('Todo:', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID:', todo);
// }).catch((e) => console.log(e));

const userId = '5a67ca3c859115d820970a91';

User.findById(userId).then((user) => {
  if (!user) {
    console.log('Unable to find user');
  }
  console.log('User by ID:', JSON.stringify(user, undefined, 2));
}, (e) => console.log(e));
