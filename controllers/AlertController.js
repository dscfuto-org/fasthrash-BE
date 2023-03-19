const Alert = require('../models/alertModel');
const axios = require('axios');
const FormData = require('form-data');
const { cloudUpload } = require('../helpers/cloudStorage');
const { default: mongoose } = require('mongoose');
const DepositHistory = require('../models/historyModels/depositHistory');
const sendEmail = require('../helpers/mailer');
const UserModel = require('../models/UserModel');
const OrgModel = require('../models/OrgModel');

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
    const { status, collectorId } = req.body;
    if (!collectorId) {
      return res.status(400).json({
        status: 'Error updating alert',
        message: 'Collector ID is required',
      });
    }
    if (status !== 'accepted') {
      return res.status(400).json({
        status: "Error updating alert, status can only be 'accepted'",
        message: 'Invalid request',
      });
    }
    const alert = await Alert.findById(req.params.id);
    alert.status = status;
    alert.collectorId = collectorId;

    let user = await UserModel.findById(alert.userId);
    let collector;

    if (await UserModel.findById(collectorId)) {
      collector = await UserModel.findById(collectorId);
    } else {
      collector = await OrgModel.findById(collectorId);
    }

    // Marshall making me do this
    alert.userName = user.firstName + ' ' + user.lastName;
    alert.userEmail = user.email;
    alert.userPhone = user.phone;
    alert.collectorName =
      collector.firstName + ' ' + collector.lastName || collector.businessName;
    alert.collectorEmail = collector.email;
    alert.collectorPhone = collector.phone;

    await alert.save();

    sendEmail.send(
      process.env.EMAIL_USER,
      user.email,
      'Yaay! Your alert has been accepted 🎊',
      'Congratulations, you have a new collector for your trash!',
      `<html lang='en'>
          <head>
            <meta charset='UTF-8' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Congratulations, you've got a new collector! 🎉</title>
          </head>
          <body>
            <p><b>Hi ${user.firstName},</b></p>
            <p>Congratulations, a collector has accepted to pick up your trash</p>
            <br/>
            <p><b>Here are the transaction details:</b></p>
            <p>Alert creator: ${user.firstName + ' ' + user.lastName}</p>
            <p>Alert collector: ${
              collector.firstName
                ? collector.firstName + collector.lastName
                : collector.businessName
            }</p>
            <p>Collector's email: ${collector.email}</p>
            <br/>
            <p>You are expected to deliver within ${
              alert.deliveryTime
            } days at the rate of #${alert.costPerKg} per KG.</p>
            <p>Kindly contact support if you need any help!/p>
          </body>
        </html>
        `
    );
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

exports.updateUserAlertStatus = async (req, res) => {
  try {
    const { status, userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        status: 'Error updating alert',
        message: 'User ID is required',
      });
    }
    const alert = await Alert.findById(req.params.id);

    if (userId !== alert.userId.toString()) {
      return res.status(400).json({
        status: `Sorry, you can't mark this alert as completed!`,
      });
    } else {
      alert.status = status;
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

// fetches all alerts created by a user/collector
exports.getAlertsByUser = async (req, res) => {
  try {
    const alert = await Alert.find({ userId: req.params.userId }).exec();
    return res.status(200).json({
      status: 'Alerts fetched successfully!',
      data: {
        alert,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Error fetching alert',
      message: err,
    });
  }
};

// fetches all alerts accepted by a collector/organization
exports.getAcceptedAlerts = async (req, res) => {
  try {
    const alert = await Alert.find({
      collectorId: req.params.collectorId,
    }).exec();
    return res.status(200).json({
      status: 'Alerts fetched successfully!',
      data: {
        alert,
      },
    });
  } catch (err) {
    return res.status(400).json({
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

exports.getAllAlertsByRoleAndStatus = async (req, res) => {
  try {
    // const userType = req.baseUrl.split('/')[2];
    const role = req.query.role;
    const status = req.query.status;

    if (!role || !status) {
      return res.status(400).json({
        status: 'Error fetching alerts',
        message: 'Role and status are required',
      });
    } else {
      if (role !== 'user' && role !== 'collector') {
        return res.status(400).json({ message: 'Invalid role provided!' });
      }
      if (
        status !== 'pending' &&
        status !== 'accepted' &&
        status !== 'collected'
      ) {
        return res.status(400).json({ message: 'Invalid status provided!' });
      } else {
        const alerts = await Alert.find({ role: role, status: status });
        return res.status(200).json({
          status: `${
            alerts.length > 1 ? 'Alerts' : 'Alert'
          } fetched successfully`,
          data: {
            alert: alerts,
          },
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

exports._deleteAlert = async (req, res) => {
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
