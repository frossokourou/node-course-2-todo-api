// MongoClient connects to the server - ObjectID creates a new id

const {MongoClient, ObjectID} = require('mongodb');

const obj = ObjectID();
console.log(obj);
console.log('date variable', obj.getTimestamp());

// define path or url of the database to connect and a callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // access the Todos collection and find all records
  // .toArray() returns a promise .then((resolved) => {}, (failed) => {})
  // db.collection('Todos').find({
  //   _id: new ObjectID('5a61056d1f41174b82f7838f')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // pass either a callback(err, count) => {} or a promise like below
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  //     }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name: 'Andrew'}).toArray().then((users) => {
    console.log(JSON.stringify(users, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch users', err);
  });

//  db.close();
});
