const processFile = require('../middlewares/upload');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('fastrash-image-upload');
const uuid = require('uuid');
const path = require('path');


const uploadFiles = async (req, res) => {
  try {
    await processFile(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const filenames = [];

      for (const file of req.files) {
        const filename = `${uuid.v4()}${path.extname(file.originalname)}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });

        blobStream.on('error', (err) => {
          return res.status(500).json({ error: `Error uploading file: ${err.message}` });
        });

        blobStream.on('finish', () => {
          filenames.push(filename);
        });

        blobStream.end(file.buffer);
      }

      return res.status(200).json({ filenames });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });

    res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: 'Unable to read list of files!',
    });
  }
};

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    res.status(500).send({
      message: 'Could not download the file. ' + err,
    });
  }
};

module.exports = { uploadFiles, getFiles, download };
