const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/:id/', historyController.getHistory);
router.put('/update/:id/', historyController.updateHistory);
router.get('/user/:userId/', historyController.getUserHistory);
router.post('/user/create/:userId', historyController.addUserHistory);
router.delete(
  '/delete/:userId/:historyId',
  historyController.deleteUserHistory
);
router.get('/org/:orgId/', historyController.getOrgHistory);
router.post('/org/create/:orgId', historyController.addOrgHistory);
router.delete(
  '/org/delete/:orgId/:historyId',
  historyController.deleteOrgHistory
);

module.exports = router;
