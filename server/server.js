const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

// start the server by calling express as a function
const app = express();

// .use() to use a middleware
// bodyParser.json(): A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body)
app.use(bodyParser.json());

// configure routes -> set up a route
// url for resources (new todo): './todos'
app.post('/todos', (req, res) => {
  // req.body object is a JSON due to app.use() above
  console.log(req.body);
  const todo = new Todo({
    text: req.body.text
  });
  console.log(JSON.stringify(todo, undefined, 2));

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// the server listens on port 3000
app.listen(3000, () => {
  console.log('Started on port 3000...');
});

// // create a new Todo
// const newTodo = new Todo({
//   text: '    Cook dinner  '
// });
//
// // update the database -> save() returns a promise
// newTodo.save().then((doc) => {
//   console.log('Saved todo', JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save todo', e);
// });
