const vision = require('@google-cloud/vision');
const { validationErrorWithData } = require('../helpers/apiResponse');

const WASTE_LABELS = ['plastic'];
const THRESHOLD = 0.7;

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'storage-keys.json'
});

async function getImageLabels(image) {
    const results = await client.labelDetection(image);
    const annotations = results[0].labelAnnotations;
    const labels = annotations.map(label => ({ label: label.description, score: label.score }));

    return labels;
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
exports.visionAIFilter = async (req, res, next) => {
    const photos = req.files;
    const results = {};

    try {
        for (let photo of photos) {
            let labels = await getImageLabels(photo.buffer);
            let validLabels = labels.filter(({label, score}) => WASTE_LABELS.includes(label.toLowerCase()) && score > THRESHOLD);

            results[photo.originalname] = validLabels.length > 0;
            if (validLabels.length > 0) continue;
            else throw new Error(`${photo.originalname} was rejected. Please verify that your plastic waste is acceptable for recycling.`);
        }
        req.filterResults = results;
        next();
    } catch (error) {
        return validationErrorWithData(res, error.message, {results});
    }
};