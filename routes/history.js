const express = require('express');
const router = express.Router();
const depositHistoryController = require('../controllers/historyControllers/DepositHistoryController');
const collectionHistoryController = require('../controllers/historyControllers/CollectionHistoryController');

// history/depositHistory
/*
  create, fetch, update & delete user deposit history
*/
router.get('/depositHistory/fetch/:id/', depositHistoryController.getDepositHistory);
router.get('/depositHistory/fetchAll/:userId/', depositHistoryController.getAllDepositHistory);
router.post('/depositHistory/create/:userId', depositHistoryController.addDepositHistory);
router.put('/depositHistory/update/:id/', depositHistoryController.updateDepositHistory);
router.delete(
  '/depositHistory/:userId/:historyId',
  depositHistoryController.deleteDepositHistory
);
// history/collectionHistory
/*
  create, fetch, update & delete user collection history
*/
router.get('/collectionHistory/fetch/:id', collectionHistoryController.getCollectionHistory);
router.get('/collectionHistory/fetchAll/:userId', collectionHistoryController.getCollectorCollectionHistory);
router.post('/collectionHistory/create/:userId', collectionHistoryController.addCollectorCollectionHistory);
router.put('/collectionHistory/update/:id', collectionHistoryController.updateCollectionHistory);
router.delete(
  '/collectionHistory/:userId/:historyId',
  collectionHistoryController.deleteCollectorCollectionHistory
);
// history/organization
/*
  create, fetch, update & delete user deposit history
*/
router.get('/orgHistory/fetch/:orgId', collectionHistoryController.getOrgCollectionHistory);
router.post('/orgHistory/create/:orgId', collectionHistoryController.addOrgCollectionHistory);
router.delete(
  '/orgHistory/:orgId/:historyId',
  collectionHistoryController.deleteOrgCollectionHistory
);

module.exports = router;
