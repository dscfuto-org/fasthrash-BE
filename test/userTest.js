const { chai, server } = require('./testConfig');
const UserModel = require('../models/UserModel');
const describe = require('mocha').describe;
const it = require('mocha').it;


describe('Auth', () => {
  // Before each test we empty the database
  before((done) => {
    // eslint-disable-next-line no-unused-vars
    UserModel.deleteMany({}, (err) => {
      done();
    });
  });


// Prepare data for testing
const testData = {
    firstName: 'test',
    lastName: 'testing',
    location: 'Owerri',
    password: 'Test@123',
    phoneNumber: '08123456789',
    email: 'fasthrash@gmail.com',
  };

/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Login
 * (2) Register
 */



/*
   * Test the /POST route
   */
describe('User Register', () => {
    it('It should Register user', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send(testData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Registration Success.');
          testData._id = res.body.data._id;
          done();
        });
    });
  });

  describe('User Login', () => {
    it('it should do user Login', (done) => {
      chai
        .request(server)
        .post('api/auth/login')
        .send({ email: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Login Success.');
          done();
        });
    });
  });
});