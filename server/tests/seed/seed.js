const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
// create mock users, second without token
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}];

// insert mock todos
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completeAt: 123
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {        // empty the test database first
    return Todo.insertMany(todos);    // then populate it with mock todos
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();    // .save() returns a promise (needs then() after)
    const userTwo = new User(users[1]).save();  // before save() pre middleware is called
    // callback will be fired when all promises in the array resolve
    // Promise.all([userOne, userTwo]).then(() => {
    //   // do sth
    // });
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
