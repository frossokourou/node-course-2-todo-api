// MongoClient connects to the server - ObjectID creates a new id
// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');
// object destructuring ES6

const obj = ObjectID();
console.log(obj);
console.log('date variable', obj.getTimestamp());

// define path or url of the database to connect and a callback
// by using TodoApp a new database is created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // 'Todos' is the name of the collection - obj: the item to insert and a callback
  // db.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     // return the error as well
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'Andrew',
    age: 25,
    location: 'Philadelphia'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert user in database', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id);
    console.log(result.ops[0]._id.getTimestamp());
  });
// _id.getTimestamp() shows when the id was created

  db.close();
});
