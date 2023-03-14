const express = require('express');
const router = express.Router();
const depositHistoryController = require('../controllers/historyControllers/DepositHistoryController');
const collectionHistoryController = require('../controllers/historyControllers/CollectionHistoryController');
const { verifyUser, verifyOrg } = require('../middlewares/verifyUser');
// history/depositHistory
/*
  create, fetch, update & delete user deposit history
*/
router.get('/deposits/fetch/:id/',verifyUser, depositHistoryController.getDepositHistory);
router.get(
  '/deposits/user/:userId/', verifyUser,
  depositHistoryController.getAllDepositHistory
);
router.post(
  '/deposits/create/:userId', verifyUser,
  depositHistoryController.addDepositHistory
);
router.put(
  '/deposits/update/:id/', verifyUser,
  depositHistoryController.updateDepositHistory
);
router.delete(
  '/deposits/:userId/:historyId', verifyUser,
  depositHistoryController.deleteDepositHistory
);
// history/collectionHistory
/*
  create, fetch, update & delete user collection history
*/
router.get(
  '/collections/fetch/:id', verifyUser,
  collectionHistoryController.getCollectionHistory
);
router.get(
  '/collections/collector/:userId', verifyUser,
  collectionHistoryController.getCollectorCollectionHistory
);
router.post(
  '/collections/create/:userId', verifyUser,
  collectionHistoryController.addCollectorCollectionHistory
);
router.put(
  '/collections/update/:id', verifyUser,
  collectionHistoryController.updateCollectionHistory
);
router.delete(
  '/collections/:userId/:historyId', verifyUser,
  collectionHistoryController.deleteCollectorCollectionHistory
);
// history/organization
/*
  create, fetch, update & delete user deposit history
*/
router.get(
  '/org/fetch/:orgId', verifyOrg,
  collectionHistoryController.getOrgCollectionHistory
);
router.post(
  '/org/create/:orgId', verifyOrg,
  collectionHistoryController.addOrgCollectionHistory
);
router.delete(
  '/org/:orgId/:historyId', verifyOrg,
  collectionHistoryController.deleteOrgCollectionHistory
);

module.exports = router;
