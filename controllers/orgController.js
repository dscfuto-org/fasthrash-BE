const Organization = require('../models/OrgModel')
// const Alert = require('../models/AlertModel');

exports.createAlert = async (req, res) => {
  try {
    const newAlert = await Organization.create(req.body);

    return res.status(200).json({
      status: 'Alert created successfully!',
      data: {
        alert: newAlert,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Error creating alert',
      message: err,
    });
  }
};

exports.getAlert = async (req, res) => {
  try {
    const alert = await Organization.findById(req.params.id);
    return res.status(200).json({
      status: 'Alerts fetched successfully!',
      data: {
        alert,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching alerts',
      message: err,
    });
  }
};
exports.getAlerts = async (req, res) => {
  try {
    const alert = await Organization.find();
    return res.status(200).json({
      status: 'Alerts fetched successfully!',
      data: {
        alert,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching alerts',
      message: err,
    });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id, req.body);
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
exports.updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({
      status: 'Alert Updated successfully',
      data: alert
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Error Updating alert',
      message: err,
    });
  }
};
