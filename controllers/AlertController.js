const Alert = require('../models/AlertModel');

exports.createAlert = async (req, res) => {
  try {
    const newAlert = await Alert.create(req.body);

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
    const alert = await Alert.findById(req.params.id);
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