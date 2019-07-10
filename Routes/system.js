const express = require('express');
const controller = require('../controllers/system');

const router = express.Router();

router.get('/config/system', controller['all']);
router.put('/config/system', controller['update']);

module.exports = router;