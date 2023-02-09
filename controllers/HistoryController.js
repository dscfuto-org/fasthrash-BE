// create a history populated data
// delete a history
// delete all history
// get all history under a user
// update history
const History = require('../models/historyModel');
const UserModel = require('../models/UserModel');
const OrgModel = require('../models/OrgModel');

exports.addUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      recyclerId,
      wasteImageUrl,
      wasteImageTitle,
      collectionStatus,
      timeDisposed,
      timeCollected,
    } = req.body;

    const newHistory = new History({
      recyclerId,
      wasteImageUrl,
      wasteImageTitle,
      collectionStatus,
      timeDisposed,
      timeCollected,
    });
    await newHistory.save();
    await UserModel.findOneAndUpdate(userId, {
      $push: {
        histories: newHistory,
      },
    });

    return res.status(201).json({
      status: 'History added successfully!',
      data: {
        history: newHistory,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Error creating history',
      message: err,
    });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const history = await UserModel.findById(req.params.userId).populate(
      'histories'
    );
    return res.status(200).json({
      status: 'History fetched successfully!',
      data: {
        history: history.histories,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching history',
      message: err,
    });
  }
};

exports.deleteUserHistory = async (req, res) => {
  try {
    const { historyId, userId } = req.params;

    await History.findByIdAndDelete(historyId);
    await UserModel.findOneAndUpdate(userId, {
      $pull: {
        histories: historyId,
      },
    });

    return res.status(204).json({
      status: 'History deleted successfully',
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error deleting alert',
      message: err,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);
    return res.status(200).json({
      status: 'History fetched successfully!',
      data: {
        history,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching history',
      message: err,
    });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHistory = await History.findByIdAndUpdate(id, req.body);

    return res.status(201).json({
      status: 'History updated successfully!',
      data: {
        history: updatedHistory,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error updating history',
      message: err,
    });
  }
};

exports.addOrgHistory = async (req, res) => {
  try {
    const { orgId } = req.params;
    const {
      recyclerId,
      wasteImageUrl,
      wasteImageTitle,
      collectionStatus,
      timeDisposed,
      timeCollected,
    } = req.body;

    const newHistory = new History({
      recyclerId,
      wasteImageUrl,
      wasteImageTitle,
      collectionStatus,
      timeDisposed,
      timeCollected,
    });
    await newHistory.save();
    await OrgModel.findOneAndUpdate(orgId, {
      $push: {
        histories: newHistory,
      },
    });

    return res.status(200).json({
      status: 'History added successfully!',
      data: {
        history: newHistory,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Error creating history',
      message: err,
    });
  }
};

exports.getOrgHistory = async (req, res) => {
  try {
    const history = await OrgModel.findById(req.params.orgId).populate(
      'histories'
    );
    return res.status(200).json({
      status: 'History fetched successfully!',
      data: {
        history: history.histories,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching history',
      message: err,
    });
  }
};

exports.deleteOrgHistory = async (req, res) => {
  try {
    const { historyId, orgId } = req.params;

    await History.findByIdAndDelete(historyId);
    await OrgModel.findOneAndUpdate(orgId, {
      $pull: {
        histories: historyId,
      },
    });

    return res.status(204).json({
      status: 'History deleted successfully',
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error deleting alert',
      message: err,
    });
  }
};
