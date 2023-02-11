const { chai, server } = require('./testConfig');
const UserModel = require('../models/UserModel');
const OrgModel = require('../models/OrgModel');
/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Login
 * (2) Register
 */

describe('User authentication', () => {
  // Before each test we empty the database
  before((done) => {
    // eslint-disable-next-line no-unused-vars
    UserModel.deleteMany({}, (err) => {
      done();
    });
  });

  // Prepare user data for testing
  const userTestData = {
    firstName: 'Chidera',
    lastName: 'Anichebe',
    location: '12.123, 12.4',
    email: 'root@localhost.com',
    phoneNumber: '08123456789',
    password: 'sup3rs3cur3pwd',
    role: 'user',
  };

  /*
   * Test the user registration route
   */
  describe('POST /api/auth/register', () => {
    it('It should register a new user', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send(userTestData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          userTestData._id = res.body._id;
          done();
        });
    });
  });

  /*
   * Test the user login route
   */
  describe('POST /api/auth/login', () => {
    it('It should do a successful user login', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({ email: userTestData.email, password: userTestData.password })
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

describe('Organization authentication', () => {
  // Before each test we empty the database
  before((done) => {
    // eslint-disable-next-line no-unused-vars
    OrgModel.deleteMany({}, (err) => {
      done();
    });
  });

  // Prepare organization data for testing
  const orgTestData = {
    businessName: 'Wall Street Cartel',
    location: '12.123, 12.4',
    size: 'Large',
    yearsOfOperation: 10,
    email: 'root@localhost.com',
    phoneNumber: '08123456789',
    password: 'sup3rs3cur3pwd',
  };

  /*
   * Test the organization registration route
   */
  describe('POST /api/auth/org/register', () => {
    it('It should register a new organization account', (done) => {
      chai
        .request(server)
        .post('/api/auth/org/register')
        .send(orgTestData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          orgTestData._id = res.body._id;
          done();
        });
    });
  });

  /*
   * Test the organization login route
   */
  describe('POST /api/auth/org/login', () => {
    it('It should do a successful organization login', (done) => {
      chai
        .request(server)
        .post('/api/auth/org/login')
        .send({ email: orgTestData.email, password: orgTestData.password })
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
