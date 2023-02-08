const assert = require('assert');
//const request = require('supertest');
const { chai, server } = require('./testConfig');
// const it = require('mocha').it;
const mocha = require('mocha');

mocha.describe('User registration', function() {
    mocha.it('should register a new user', function(done) {
     chai. request(server)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 123 456 7890',
          location: 'San Francisco',
          password: 'secret'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.message, 'User created successfully');
          done();
        });
    });
  });
