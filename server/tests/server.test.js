// mocha & nodemon do not need to be required
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

// insert mock todos
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

// before each test empty the database
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// describe() to group tests
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    // make the request via supertest
    request(app)  // pass the app where we want to make the request on
      .post('/todos')   // to make a post request
      .send({text})   // to send data along with the request (supertest converts {text} to json)
      .expect(200)    // make assert ions about the request -> status
      // make assertions about the body that comes back -> result
      .expect((res) => {
        expect(res.body.text).toBe(text);       // ???
      })
      // end the request
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // verify that todo was added
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);   // one todo was added
          expect(todos[0].text).toBe(text);
          // use done(), because it is async
          done();
        }).catch((e) => done(e));     // to catch any errors from above assertions
      });   // request ends here
  });

  // the beforeEach will run also before this one
  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

 describe('DELETE /todos/:id', () => {
   it('should remove todo', (done) => {
     const hexId = todos[1]._id.toHexString();

     request(app)
     .delete(`/todos/${hexId}`)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo._id).toBe(hexId);   // res.body (response defined by supertest)
     })
     // pass a callback to check async before ending
     .end((err, res) => {
       if (err) {
         return done(err);
       }
       // verify that todo was removed
       Todo.findById(hexId).then((todo) => {
         expect(todo).toNotExist();
         done();
       }).catch((e) => done(e));   // to catch any errors from above assertion
     });
   });
   it('should return 404 if todo not found', (done) => {
     request(app)
     .delete(`/todos/${new ObjectID().toHexString()}`)    // creates a new ObjectID
     .expect(404)
     .end(done);
   });
   it('should return 404 if object id is invalid', (done) => {
     request(app)
     .delete('/todos/123')
     .expect(404)
     .end(done);
   });
 });
