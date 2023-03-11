const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
const imageSchema = require('../models/imgModel');

const storage = new Storage({ keyFilename: 'storage-keys.json' });
const bucket = storage.bucket('fastrash-image-upload');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const cloudUpload = async (req) => {
    if (req.files.length === 0) throw new Error('Please upload at least 1 file!');
    const alertImages = [];
    const uploadErrors = [];

    for (const file of req.files) {
        try {
            // create a new blob in the bucket and upload the file data
            let uniquename = `${file.fieldname}-${uuid.v4()}-${file.originalname}`;
            // const { apiResponse } = await bucket.upload(file.originalname, { resumable: false, destination: uniquename });
            // console.log(apiResponse);

            const blob = bucket.file(uniquename);
            await blob.save(file.buffer, {resumable: false});
            await blob.makePublic();
            const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            console.log(publicUrl);

            const newImage = new imageSchema({ url: publicUrl });
            await newImage.save();

            alertImages.push(publicUrl);
        } catch (error) {
            console.log(error);
            uploadErrors.push(error.message);
            continue;
        }
    }

    return { alertImages, uploadErrors };
};

module.exports = {
    cloudUpload,
};