// MongoClient connects to the server - ObjectID creates a new id

const {MongoClient, ObjectID} = require('mongodb');

// define path or url of the database to connect and a callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // // use with the update operator $set and option {returnOriginal: false}
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a6164e11a91fa17a0a97ede')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // can perform two updates at once
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a61682d4c1c441937931d07')
  }, {
    $set: {
      name: 'Andrew'
    },
    $inc: {
      age: -1
    }
  }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    });

  //  db.close();
});
