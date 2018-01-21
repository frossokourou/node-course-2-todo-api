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

  // deleteMany -> deletes all that match the criteria -> result: {ok: 1, n: 3} how many were deleted
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne -> deletes the first that matches the criteria -> deletedCount: 1
  // db.collection('Todos').deleteOne({text: 'something to do'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete -> deletes one but sends back the data
  // db.collection('Todos').findOneAndDelete({completed: true}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Andrew'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a6164f4cabe4117b504fa1b')
  }).then((result) => {
    console.log(result);
  });

  //  db.close();
});
