const { chai, server } = require("./testConfig");
const { imageSchema } = require("../models/imgModel");
const { Storage } = require('@google-cloud/storage');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('fastrash-image-upload');

/**
 * Test cases to test all the upload image APIs
 * Covered Routes:
 * (1) Upload
 * (2) Get Files
 * (3) Download
 */

describe("Image Upload", () => {
  // Before each test we empty the database
  before((done) => {
    // eslint-disable-next-line no-unused-vars
    imageSchema.deleteMany({}, (err) => {
      done();
    });
  });

  // Prepare image data for testing
  const imageTestData = {
    _id: "asrf245gr4325yh",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnysF6uZMusij8xmeGSV4UI6H7yUaJCxTo9zRX-Ex7&s",
    title: "Bottles",
  };

  /*
   * Test the Image upload route
   */
  describe('POST /api/auth/upload', () => {
    it('It should successfully upload an image', (done) => {
      chai
        .request(server)
        .post('/api/auth/upload')
        .attach('image', imageTestData.url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          done();
        });
    });
  });

  /*
   * Test the get image route
   */
  describe('GET /api/auth/process.env.FETCH_FILES', () => {
    it('It should retrieve an image', (done) => {
      chai
        .request(server)
        .get('/api/auth/process.env.FETCH_FILES')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('fileInfos');
          imageTestData.url = res.body.url;
          done();
        });
    });
  });
  
  /*
   * Test the download image route
   */
  describe('GET /api/auth/file/download/:name', () => {
    it('It should download an image', (done) => {
      chai
        .request(server)
        .get('/api/auth/file/download/:name')
        .end((err, res) => {
          const [metaData] = bucket.file(res.params.name).getMetadata();
          res.should.have.redirect(metaData.mediaLink);
          imageTestData.title = res.body.name;
          done();
        });
    });
  });
});

