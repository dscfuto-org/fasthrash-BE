const processFile = require('../middlewares/upload');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('fastrash-image-upload');
const uuid = require('uuid');
const imageSchema = require('../models/imgModel');

const upload = async (req, res) => {
  const NON_IMAGE =
    'Error: Invalid file type. Only jpg, jpeg, and png files are allowed.';
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    // Create a new blob in the bucket and upload the file data.
    let uniquename = `${req.file.fieldname}-${uuid.v4()}-${
      req.file.originalname
    }`;
    const blob = bucket.file(uniquename);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      return res.status(400).send({ message: err.message });
    });

    // eslint-disable-next-line no-unused-vars
    blobStream.on('finish', async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch (err) {
        const newImage = new imageSchema({
          url: publicUrl,
        });

        await newImage.save();
        return res.status(200).send({
          message: `Uploaded the file successfully: ${req.file.originalname}`,
          url: publicUrl,
        });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File cannot be larger than 10MB',
      });
    }
    return res.status(err !== NON_IMAGE ? 400 : 500).send({
      message: `Could not upload the file - ${err}`,
    });
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

    return res.status(200).send(fileInfos);
  } catch (err) {
    return res.status(401).send({
      message: 'Unable to read list of files!',
      err,
    });
  }
};

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    return res.status(401).send({
      message: 'Could not download the file. ' + err,
    });
  }
};

module.exports = { upload, getFiles, download };
