const Alert = require('../models/alertModel');
const axios = require('axios');
const FormData = require('form-data');

exports.createAlert = async (req, res) => {
  try {
    const imageData = req.file;
    const alertData = req.body;

    try {
      // create a new formdata object and append the image data
      const formData = new FormData();
      formData.append('file', imageData.buffer, imageData.originalname);

      // make a post request to the image upload API
      await axios
        .post(process.env.IMAGE_UPLOAD_API, formData, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          },
        })
        .then(async (response) => {
          const imageUrl = response.data.url;
          const alert = { ...alertData, image: imageUrl };

          // store the alert data in MongoDB, including the image URL
          await Alert.create(alert).then((result) => {
            return res.status(201).json({
              status: 'Alert created successfully!',
              data: {
                alert: result.toJSON(),
              },
            });
          });
        })
        .catch((err) => {
          return res.status(400).json({ message: err.message });
        });
    } catch (err) {
      return res
        .status(400)
        .json({ status: 'Error uploading image', message: err });
    }
  } catch (err) {
    return res.status(400).json({
      status: 'Error creating alert',
      message: err,
    });
  }
};

exports.fetchAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    return res.status(200).json({
      status: 'Alerts fetched successfully!',
      data: {
        alerts,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching alerts',
      message: err,
    });
  }
};
exports.getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    return res.status(200).json({
      status: 'Alert fetched successfully!',
      data: {
        alert,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching alert',
      message: err,
    });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id, req.body);
    return res.status(204).json({
      status: 'Alert deleted successfully',
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error deleting alert',
      message: err,
    });
  }
};
