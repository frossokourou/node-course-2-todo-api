const mongoose = require('mongoose');

// configuration to use promises, a feature built in the language
mongoose.Promise = global.Promise;
// connect to the database -> just provide the url and the name of the db to create
const url = 'mongodb://frossokourou:mLabHerokuDB12@ds125318.mlab.com:25318/node-todos-api-course' || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(url);

module.exports = {
  mongoose
};
