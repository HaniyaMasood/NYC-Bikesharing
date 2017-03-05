var express = require('express');
var router = express.Router();
var dataController = require('../controllers/dataController');

////////////////////////////The purpose of this router is only to call controller functions and route the requests/////////////////////////
router.get('/', dataController.getData);

module.exports = router;


