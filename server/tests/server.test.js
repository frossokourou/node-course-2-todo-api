// mocha & nodemon do not need to be required
const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

// before each test empty the database
beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
        Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
