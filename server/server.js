require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

// start the server by calling express as a function
const app = express();
// set a port in order to deploy to Heroku
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
  // get the id
  const id = req.params.id;
  console.log('id:', id);

  // validate the id -> not vallid? return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    // if no doc, send 404
    if (!todo) {
      return res.status(404).send();
    }
    // if doc, send doc back with 200
    res.status(200).send({todo});
    // error -> 400 with empty body
  }).catch((e) => {
    res.status(400).send();
  });
});

// update a document -> route: PATCH
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  // _.pick(obj, ['a', 'b']) --> Creates an object composed of the picked object properties
  const body = _.pick(req.body, ['text', 'completed']);  // in the array properties to update if they exist

  // validate the id
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // check if there is a completed value and is equal to true
  if (_.isBoolean(body.completed) && body.completed) {
    // set a timestamp for completion
    body.completedAt = new Date().getTime();
  } else {
    // there is no key named 'completed' in the body object
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body      // body is an object with the keys 'text', 'completed', 'completedAt'
  }, {
    new: true         // instead of {returnOriginal: false} used in mongodb
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});



// the server listens on port 3000
app.listen(port, () => {
  console.log(`Started up at port ${port}...`);
  console.log(process.env.MONGODB_URI);
});

module.exports = {
  app
};
