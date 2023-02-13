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

describe("Alert Testing", () => {
    // Before each test we empty the database
    before((done) => {
      // eslint-disable-next-line no-unused-vars
      alertSchema.deleteMany({}, (err) => {
        done();
      });
    });
  
    // Prepare alert data for testing
    const alertTestData = {
      title: "bottle",
      description: "Lorem ipsum",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnysF6uZMusij8xmeGSV4UI6H7yUaJCxTo9zRX-Ex7&s",
      location: "Lagos, Nigeria",
      quantity: 59,
      timestamps: "",
    };
  
    /*
     * Test the collector create alert route
     */
    describe('POST /api/auth/create', () => {
      it('It should create alert', (done) => {
        chai
          .request(server)
          .post('/api/auth/create')
          .send(alertTestData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('Alert created successfully!');
            alertTestData._id = res.body._id;
            done();
          });
      });
    });
  
    /*
     * Test the get alert route
     */
    describe('GET /api/auth/:id', () => {
      it('It should get collector alert', (done) => {
        chai
          .request(server)
          .get('/api/auth/:id')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status')
            .eql('Alert fetched successfully!');
            alertTestData.description= res.body.description;
            done();
          });
      });
    });

     /*
     * Test the delete alert route
     */
     describe('DELETE /api/auth/:id', () => {
        it('It should delete an alert', (done) => {
          chai
            .request(server)
            .delete('/api/auth/:id')
            .end((err, res) => {
              res.should.have.status(204);
              res.body.should.have.property('status')
              .eql('Alert deleted successfully');
              done();
            });
        });
      });
    
    /*
     * Test the delete alert for collector route
     */
    describe('DELETE /api/auth/file/delete/:id', () => {
      it('It should delete collector alert', (done) => {
        chai
          .request(server)
          .delete('/api/auth/file/delete/:id')
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
    describe('DELETE /api/auth/file/delete/:id', () => {
        it('It should delete collector alert', (done) => {
          chai
            .request(server)
            .post('/api/auth/file/delete/:id')
            .send(alertTestData)
            .end((err, res) => {
              res.should.have.status(200);
              alertTestData.title = res.body.name;
              done();
            });
        });
      });
  });
  
  