const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/getHistory/:id/", historyController.getHistory);
router.put("/updateHistory/:id/", historyController.updateHistory);
router.get("/getUserHistory/:userId/", historyController.getUserHistory);
router.post("/addUserHistory/:userId", historyController.addUserHistory);
router.delete('/deleteUserHistory/:userId/:historyId', historyController.deleteUserHistory);
router.get("/getOrgHistory/:orgId/", historyController.getOrgHistory);
router.post("/addOrgHistory/:orgId", historyController.addOrgHistory);
router.delete('/deleteOrgHistory/:orgId/:historyId', historyController.deleteOrgHistory);

module.exports = router;
