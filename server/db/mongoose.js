const mongoose = require('mongoose');

// configuration to use promises
mongoose.Promise = global.Promise;
// connect to the database -> just provide the url and the name of the db to create
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
