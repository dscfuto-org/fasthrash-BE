const Alert = require('../models/alertModel');
const axios = require('axios');
const FormData = require('form-data');
const { cloudUpload } = require('../helpers/cloudStorage');
const { default: mongoose } = require('mongoose');
const DepositHistory = require('../models/historyModels/depositHistory');

/**
 * create alert and add the created alert to user deposit history
 */
exports.createAlert = async (req, res) => {
  const alertData = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { alertImages, uploadErrors } = await cloudUpload(req);
    if (alertImages < 1) {
      console.log(uploadErrors);
      throw new Error('Error uploading images');
    }

    // const newAlert = await Alert.create([{ ...alertData, images: alertImages }], {session});
    const newAlert = new Alert({ ...alertData, images: alertImages });
    await newAlert.save({ session });
    const newHistory = new DepositHistory([
      {
        userId: alertData.userId,
        alertId: newAlert._id,
      },
    ]);
    await session.commitTransaction();

    return res.status(201).json({
      status: 'Alert (and history) created successfully!',
      message: `${alertImages.length} images uploaded, ${uploadErrors.length} failed.`,
      data: {
        alert: newAlert.toJSON(),
        deposit: newHistory.toJSON(),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({
      status: 'Error creating alert',
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

exports._createAlert = async (req, res) => {
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

exports.updateAlertStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (status === 'pending') {
      alert.status = 'pending';
    } else if (status === 'accepted') {
      alert.status = 'accepted';
    } else if (status === 'collected') {
      alert.status = 'collected';
    } else {
      return res.status(400).json({
        status: 'Error updating alert',
        message: 'Invalid status',
      });
    }

    await alert.save();

    return res.status(200).json({
      status: 'Alert updated successfully!',
      data: {
        alert,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Error updating alert',
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

exports.getAlertsByUser = async (req, res) => {
  try {
    const alert = await Alert.find({ userId: req.params.userId }).exec();
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

exports.getAllAlertsByRole = async (req, res) => {
  try {
    const userType = req.baseUrl.split('/')[2];
    const role = req.query.role;
    if (!role) {
      const alerts = await Alert.find();
      return res.status(200).json({
        status: 'Alerts fetched successfully',
        data: {
          alert: alerts,
        },
      });
    } else {
      if (role !== 'user' && role !== 'collector') {
        return res.status(400).json({ message: 'Invalid role provided!' });
      }
      if (userType === 'org' && role === 'collector') {
        const alerts = await Alert.find({ role: 'collector' });
        return res.status(200).json({
          status: `${
            alerts.length > 1 ? 'Alerts' : 'Alert'
          } fetched successfully`,
          data: {
            alert: alerts,
          },
        });
      } else if (userType !== 'org' && role === 'user') {
        const alerts = await Alert.find({ role: 'user' });
        return res.status(200).json({
          status: `${
            alerts.length > 1 ? 'Alerts' : 'Alert'
          } fetched successfully`,
          data: {
            alert: alerts,
          },
        });
      } else {
        return res.status(400).json({
          message: `You cannot fetch ${role} alerts`,
        });
      }
    }
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching alerts',
      message: err,
    });
  }
};

exports.deleteAlert = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Alert.findByIdAndDelete(req.params.id, req.body, { session });
    await DepositHistory.findOneAndDelete(
      { alertId: req.params.id },
      { session }
    );
    await session.commitTransaction();
    return res.status(204).json({
      status: 'Alert (with history) deleted successfully',
      data: null,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(404).json({
      status: 'Error deleting alert',
      message: err,
    });
  } finally {
    await session.endSession();
  }
};
