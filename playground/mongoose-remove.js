const {ObjectID} =require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// removes them all from the database -> returns number of removed docs
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// returns the removed item
// Todo.findByIdAndRemove('5a835eff82a64166ffe74254').then((todo) => {
//   console.log(todo);
// });

// same as previous
Todo.findOneAndRemove({_id: '57c4610dbb35fcbf6fda1154'}).then((todo) => {
  console.log(todo);
});
