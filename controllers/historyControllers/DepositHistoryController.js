const DepositHistory = require('../../models/historyModels/depositHistory');
const UserModel = require('../../models/UserModel');

exports.addDepositHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      collectorId,
      wasteImageUrl,
      wasteImageDescription,
      collectionStatus,
      timeCollected,
    } = req.body;

    const newHistory = new DepositHistory({
      userId,
      collectorId,
      wasteImageUrl,
      wasteImageDescription,
      collectionStatus,
      timeCollected,
    });

    await newHistory.save();

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          depositHistories: newHistory,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      status: 'DepositHistory added successfully!',
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

exports.getAllDepositHistory = async (req, res) => {
  try {
    const history = await UserModel.findById(req.params.userId).populate(
      'depositHistories'
    );
    return res.status(200).json({
      status: 'DepositHistory fetched successfully!',
      data: {
        history: history.depositHistories,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching history',
      message: err,
    });
  }
};

exports.getDepositHistory = async (req, res) => {
  try {
    const history = await DepositHistory.findById(req.params.id);
    return res.status(200).json({
      status: 'DepositHistory fetched successfully!',
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

exports.updateDepositHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDepositHistory = await DepositHistory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(201).json({
      status: 'DepositHistory updated successfully!',
      data: {
        history: updatedDepositHistory,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error updating history',
      message: err,
    });
  }
};

exports.deleteDepositHistory = async (req, res) => {
  try {
    const { historyId, userId } = req.params;

    await DepositHistory.findByIdAndDelete(historyId);
    let result = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          depositHistories: historyId,
        },
      },
      { new: true }
    );

    return res.status(202).json({
      status: 'DepositHistory deleted successfully',
      data: result,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error deleting history',
      message: err,
    });
  }
};
