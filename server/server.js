const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

// start the server by calling express as a function
const app = express();
// set a port in order to deploy to Heroku
const port = process.env.PORT || 3000;

// .use() to use a middleware
// bodyParser.json(): A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body)
app.use(bodyParser.json());

// Create Resource Endpoint -> set up a route
// url for resources (new todo): '/todos'
app.post('/todos', (req, res) => {
  // req.body object is a JSON due to app.use() above
  console.log(req.body);
  // use the data from the client request ->  req.body
  const todo = new Todo({
    text: req.body.text
  });
  console.log(JSON.stringify(todo, undefined, 2));

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    // from http statuses.com
    res.status(400).send(e);
  });
});

// List resources
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});        // sending back an object lets you add fields
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  const id = req.params.id;         // the user gives the id via the url /todos/:id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  }
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// the server listens on port 3000
app.listen(port, () => {
  console.log(`Started up at port ${port}...`);
});

module.exports = {
  app
};
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
