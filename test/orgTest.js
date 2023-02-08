const { chai, server } = require('./testConfig');
//const UserModel = require('../models/UserModel');

// Prepare data for testing
const testData = {
    businessName: 'fastrash',
    location: 'Owerri',
    size: '50',
    yearsOfOperation: '20',
    password: 'Test@123',
    email: 'fasthrash@gmail.com',
    phoneNumber: '08123456789',
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
describe('POST Register', () => {
    it('It should Register Organization', (done) => {
      chai
        .request(server)
        .post('/register')
        .send(testData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Registration Success.');
          testData._id = res.body.data._id;
          done();
        });
    });
  });

  describe('POST Login', () => {
    it('it should do user Login', (done) => {
      chai
        .request(server)
        .post('/login')
        .send({ email: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Login Success.');
          done();
        });
    });
  });

