const { chai, server } = require('./testConfig');
const alertSchema = require('../models/alertModel');
/**
 * Test cases to test all the create alert APIs
 * Covered Routes:
 * (1) Create user->collector alert
 * (2) Create collector->organization alert
 * (3) Delete alerts
 * (4) Update alerts
 */

describe('Alert Testing', () => {
  // Before each test we empty the database
  before((done) => {
    // eslint-disable-next-line no-unused-vars
    alertSchema.deleteMany({}, (err) => {
      done();
    });
  });

  // Prepare alert data for testing
  let alertTestData = {
    title: 'New alert',
    description: 'Lorem ipsum',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnysF6uZMusij8xmeGSV4UI6H7yUaJCxTo9zRX-Ex7&s',
    location: '125.4, 34.7',
    quantity: 59,
  };

  /*
   * Test the collector create alert route
   */
  describe('POST /api/alerts/create/', () => {
    it('It should create alert', (done) => {
      chai
        .request(server)
        .post('/api/alerts/create/')
        .send(alertTestData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property('status')
            .eql('Alert created successfully!');
          alertTestData._id = res.body.data.alert._id;
          alertTestData.createdAt = res.body.data.alert.createdAt;
          alertTestData.updatedAt = res.body.data.alert.updatedAt;
          done();
        });
    });
  });

  /*
   * Test the get alert route
   */
  describe(`GET /api/alerts/${alertTestData._id}`, () => {
    it('It should get user/collector alert', (done) => {
      chai
        .request(server)
        .get(`/api/alerts/${alertTestData._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property('status')
            .eql('Alert fetched successfully!');
          done();
        });
    });
  });

  /*
   * Test the delete alert route
   */
  describe(`DELETE /api/alerts/delete/${alertTestData._id}`, () => {
    it('It should delete an alert', (done) => {
      chai
        .request(server)
        .delete(`/api/alerts/delete/${alertTestData._id}`)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.have
            .property('status')
            .eql('Alert deleted successfully');
          done();
        });
    });
  });

  /*
   * Test the delete alert for collector route
   */
  describe(`DELETE /api/alerts/delete/${alertTestData._id}`, () => {
    it('It should delete collector alert', (done) => {
      chai
        .request(server)
        .delete(`/api/alerts/delete/${alertTestData._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.have.property('status').eql('Alert deleted successfully');
          done();
        });
    });
  });

  /*
   * Test the delete alert for organization route
   */
  describe(`DELETE /api/alerts/org/delete/${alertTestData._id}`, () => {
    it('It should delete organization alert', (done) => {
      chai
        .request(server)
        .post(`/api/auth/file/delete/${alertTestData._id}`)
        .send(alertTestData)
        .end((err, res) => {
          res.should.have.status(200);
          alertTestData.title = res.body.name;
          done();
        });
    });
  });
});
