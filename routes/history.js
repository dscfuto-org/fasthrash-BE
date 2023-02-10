const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const historyController = require("../controllers/HistoryController");
=======
const historyController = require('../controllers/HistoryController');
>>>>>>> 1a4541b44013eb45a55cf993fc5ce3ebe7f867c6

router.get('/fetch/:id/', historyController.getHistory);
router.put('/update/:id/', historyController.updateHistory);
router.get('/user/:userId/', historyController.getUserHistory);
router.post('/create/:userId', historyController.addUserHistory);
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
