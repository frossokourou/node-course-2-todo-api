// mocha & nodemon do not need to be required
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// before each test empty the database and insert mock docs
beforeEach(populateUsers);
beforeEach(populateTodos);

// describe() to group tests
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    // make the request via supertest
    request(app)  // pass the app where we want to make the request on
      .post('/todos')   // url to make a post request
      .set('x-auth', users[0].tokens[0].token)    // sets a header to be used by authenticate
      .send({text})   // to send data along with the request (supertest converts {text} to json)
      .expect(200)    // make assertions about the request -> status
      // make assertions about the body that comes back -> result
      .expect((res) => {
        expect(res.body.text).toBe(text);
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);    // only one is created by first user
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)    // id of the first user
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)    // id of the first user
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)  // id is new, does not exist
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')        // 123 is not an object id
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

 describe('DELETE /todos/:id', () => {
   it('should remove todo', (done) => {
     const hexId = todos[1]._id.toHexString();

     request(app)
     .delete(`/todos/${hexId}`)
     .set('x-auth', users[1].tokens[0].token)     // authenticate as the second user
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

   it('should not remove todo if created by another user', (done) => {
     const hexId = todos[0]._id.toHexString();   // it belongs to the first user

     request(app)
     .delete(`/todos/${hexId}`)
     .set('x-auth', users[1].tokens[0].token)     // authenticate as the second user
     .expect(404)
     // pass a callback to check async before ending
     .end((err, res) => {
       if (err) {
         return done(err);
       }
       // verify that todo was removed
       Todo.findById(hexId).then((todo) => {
         expect(todo).toExist();  // it was not deleted
         done();
       }).catch((e) => done(e));   // to catch any errors from above assertion
     });
   });

   it('should return 404 if todo not found', (done) => {
     request(app)
     .delete(`/todos/${new ObjectID().toHexString()}`)    // creates a new ObjectID
     .set('x-auth', users[1].tokens[0].token)
     .expect(404)
     .end(done);
   });

   it('should return 404 if object id is invalid', (done) => {
     request(app)
     .delete('/todos/123')
     .set('x-auth', users[1].tokens[0].token)
     .expect(404)
     .end(done);
   });
 });

 describe('PATCH /todos/:id', () => {
   it('should update the todo', (done) => {
     const id = todos[0]._id.toHexString();
     const body = {
       text: 'This is the updated text',
       completed: true
     };

     request(app)
     .patch(`/todos/${id}`)
     .set('x-auth', users[0].tokens[0].token)
     .send(body)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(body.text);
       expect(res.body.todo.completed).toBe(true);
       expect(res.body.todo.completedAt).toBeA('number');
     })
     .end(done);
   });

   it('should not update todo created by other user', (done) => {
     const id = todos[0]._id.toHexString();
     const body = {
       text: 'This is the updated text',
       completed: true
     };

     request(app)
     .patch(`/todos/${id}`)
     .set('x-auth', users[1].tokens[0].token)
     .send(body)
     .expect(404)
     .end(done);
   });

   it ('should clear completedAt when todo is not complete', (done) => {
     const hexId = todos[1]._id.toHexString();
     const text = 'Updated todo text';

     request(app)
     .patch(`/todos/${hexId}`)
     .set('x-auth', users[1].tokens[0].token)
     .send({
       text,
       completed: false,
       completedAt: null
     })
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(text);
       expect(res.body.todo.completed).toBe(false);
       expect(res.body.todo.completedAt).toNotExist();
     })
     .end(done);
   });
 });

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    // set a header
    .set('x-auth', users[0].tokens[0].token)      // sets a header as request data
    // the first user should be authenticated
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = '123mnb!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err) {
        return done(err);
      }

      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request is invalid', (done) => {
    // valid email & password at least 6 characters
    request(app)
    .post('/users')
    .send({
      email: 'andrew.com',     // invalid email
      password: '123'         // invalid password --> better test them separately
    })
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
      // email should be unique
      const email = users[0].email;   // already exists from seed.js
      const password = '123asd!';

      request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {

    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,      // second user
      password: users[1].password     // valid email & password
    })
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toExist();
    })
    // make assertions about the response
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        // after login, user.generateAuthToken() is called and token is created
         expect(user.tokens[0]).toInclude({
           access: 'auth',
           token: res.header['x-auth']
         });
         done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'password123'     // wrong password
    })
    .expect(400)
    .expect((res) => {
      expect(res.header['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // use first user from seed.js
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)     // sets a header, route uses the token to authenticate
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
