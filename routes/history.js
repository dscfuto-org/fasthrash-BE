const express = require('express');
const router = express.Router();
const depositHistoryController = require('../controllers/historyControllers/DepositHistoryController');
const collectionHistoryController = require('../controllers/historyControllers/CollectionHistoryController');

// history/depositHistory
/*
  create, fetch, update & delete user deposit history
*/
router.get('/deposits/fetch/:id/', depositHistoryController.getDepositHistory);
router.get(
  '/deposits/user/:userId/',
  depositHistoryController.getAllDepositHistory
);
router.post(
  '/deposits/create/:userId',
  depositHistoryController.addDepositHistory
);
router.put(
  '/deposits/update/:id/',
  depositHistoryController.updateDepositHistory
);
router.delete(
  '/deposits/:userId/:historyId',
  depositHistoryController.deleteDepositHistory
);
// history/collectionHistory
/*
  create, fetch, update & delete user collection history
*/
router.get(
  '/collections/fetch/:id',
  collectionHistoryController.getCollectionHistory
);
router.get(
  '/collections/collector/:userId',
  collectionHistoryController.getCollectorCollectionHistory
);
router.post(
  '/collections/create/:userId',
  collectionHistoryController.addCollectorCollectionHistory
);
router.put(
  '/collections/update/:id',
  collectionHistoryController.updateCollectionHistory
);
router.delete(
  '/collections/:userId/:historyId',
  collectionHistoryController.deleteCollectorCollectionHistory
);
// history/organization
/*
  create, fetch, update & delete user deposit history
*/
router.get(
  '/org/fetch/:orgId',
  collectionHistoryController.getOrgCollectionHistory
);
router.post(
  '/org/create/:orgId',
  collectionHistoryController.addOrgCollectionHistory
);
router.delete(
  '/org/:orgId/:historyId',
  collectionHistoryController.deleteOrgCollectionHistory
);

module.exports = router;
