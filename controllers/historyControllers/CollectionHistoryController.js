const CollectionHistory = require('../../models/historyModels/collectionHistory');
const UserModel = require('../../models/UserModel');
const OrgModel = require('../../models/OrgModel');

exports.addCollectorCollectionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ownerId, wasteImageUrl, wasteImageDescription, timeCollected } =
      req.body;

    const newHistory = new CollectionHistory({
      collectorId: userId,
      ownerId,
      wasteImageUrl,
      wasteImageDescription,
      timeCollected,
    });

    await newHistory.save();

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          collectionHistories: newHistory,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      status: 'CollectionHistory added successfully!',
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

exports.getCollectorCollectionHistory = async (req, res) => {
  try {
    const history = await UserModel.findById(req.params.userId).populate(
      'collectionHistories'
    );
    return res.status(200).json({
      status: 'CollectionHistory fetched successfully!',
      data: {
        history: history.collectionHistories,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching history',
      message: err,
    });
  }
};

exports.getCollectionHistory = async (req, res) => {
  try {
    const history = await CollectionHistory.findById(req.params.id);
    return res.status(200).json({
      status: 'CollectionHistory fetched successfully!',
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

exports.updateCollectionHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCollectionHistory = await CollectionHistory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(201).json({
      status: 'CollectionHistory updated successfully!',
      data: {
        history: updatedCollectionHistory,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error updating history',
      message: err,
    });
  }
};

exports.deleteCollectorCollectionHistory = async (req, res) => {
  try {
    const { historyId, userId } = req.params;

    await CollectionHistory.findByIdAndDelete(historyId);
    let result = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          collectionHistories: historyId,
        },
      },
      { new: true }
    );

    return res.status(202).json({
      status: 'CollectionHistory deleted successfully',
      data: result,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error deleting history',
      message: err,
    });
  }
};

exports.addOrgCollectionHistory = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { ownerId, wasteImageUrl, wasteImageDescription, timeCollected } =
      req.body;

    const newHistory = new CollectionHistory({
      collectorId: orgId,
      ownerId,
      wasteImageUrl,
      wasteImageDescription,
      timeCollected,
    });
    await newHistory.save();
    await OrgModel.findByIdAndUpdate(
      orgId,
      {
        $push: {
          collectionHistories: newHistory,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: 'CollectionHistory added successfully!',
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

exports.getOrgCollectionHistory = async (req, res) => {
  try {
    const history = await OrgModel.findById(req.params.orgId).populate(
      'collectionHistories'
    );
    return res.status(200).json({
      status: 'CollectionHistory fetched successfully!',
      data: {
        history: history.collectionHistories,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error fetching history',
      message: err,
    });
  }
};

exports.deleteOrgCollectionHistory = async (req, res) => {
  try {
    const { historyId, orgId } = req.params;

    await CollectionHistory.findByIdAndDelete(historyId);
    let result = await OrgModel.findByIdAndUpdate(
      orgId,
      {
        $pull: {
          collectionHistories: historyId,
        },
      },
      { new: true }
    );

    return res.status(202).json({
      status: 'CollectionHistory deleted successfully',
      data: result,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'Error deleting history',
      message: err,
    });
  }
};
