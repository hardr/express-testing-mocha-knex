process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/app');
const knex = require('../../src/server/db/knex');

describe('routes : users', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  afterEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /api/v1/users', () => {
    it('should respond with all users', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [2 user objects]}
        res.body.data.length.should.eql(2);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'username', 'email', 'created_at'
        );
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should respond with a single user', (done) => {
      chai.request(server)
      .get('/api/v1/users/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 user object}
        res.body.data[0].should.include.keys(
          'id', 'username', 'email', 'created_at'
        );
        done();
      });
    });
  });

  describe('POST /api/v1/users', () => {
    it('should respond with a success message along with a single user that was added', (done) => {
      chai.request(server)
      .post('/api/v1/users')
      .send({
        username: 'ryan',
        email: 'ryan@ryan.com'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id', 'username', 'email', 'created_at');
        done();
      });
    });
    it('should throw error when username is not provided', (done) => {
      chai.request(server)
      .post('/api/v1/users')
      .send({
        email: 'incomplete@ryan.com'
      })
      .end((err, res) => {
        done();
      });
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update a user field and return before and after info', (done) => {
      knex('users')
      .select('*')
      .then((user) => {
        const userObject = user[0];
        chai.request(server)
        .put(`/api/v1/users/${userObject.id}`)
        .send({
          username: 'updatedUser',
          email: 'updated@user.com'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          var newUserObject = res.body.data[0];
          newUserObject.username.should.not.eql(userObject.username);
          newUserObject.email.should.not.eql(userObject.email);
          newUserObject.username.should.eql('updatedUser');
          newUserObject.email.should.eql('updated@user.com');
          done();
        });
      });

    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should respond with a success message along with single user that was deleted', (done) => {
      knex('users')
      .select('*')
      .then((users) => {
        const userObject = users[0];
        const lengthBeforeDelete = users.length;
        chai.request(server)
        .delete(`/api/v1/users/${userObject.id}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id', 'username', 'email', 'created_at'
          );
          knex('users').select('*')
          .then((updatedUsers) => {
            updatedUsers.length.should.eql(lengthBeforeDelete - 1);
            done();
          });
        });
      });

    });
  });

});
