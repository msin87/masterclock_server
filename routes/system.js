const express = require('express');
const controller = require('../config/controllers/system');

const router = express.Router();

router.get('/system', controller['all']);
router.put('/system', controller['update']);

module.exports = router;