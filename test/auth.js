const { chai, server } = require('./testConfig');
const UserModel = require('../models/UserModel');
/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Login
 * (2) Register
 */

describe('Authentication', () => {
  // Before each test we empty the database
  before((done) => {
    // eslint-disable-next-line no-unused-vars
    UserModel.deleteMany({}, (err) => {
      done();
    });
  });

  // Prepare data for testing
  const testData = {
    firstName: 'Chidera',
    lastName: 'Anichebe',
    location: '12.123, 12.4',
    email: 'root@localhost.com',
    phoneNumber: '08123456789',
    password: 'sup3rs3cur3pwd',
    role: 'user',
  };

  /*
   * Test the /POST route
   */
  describe('POST /api/auth/register', () => {
    it('It should register a new user', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send(testData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          testData._id = res.body._id;
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('It should do a successful user login', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({ email: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property('message')
            .eql('Authorization successful');
          done();
        });
    });
  });
});
