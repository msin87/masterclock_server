const express = require('express');
const controller = require('../config/controllers/schedule');

const router = express.Router();

router.get('/config/schedule', controller['all']);
router.get('/config/schedule/:id', controller['findById']);
router.post('/config/schedule', controller['push']);
router.put('/config/schedule/:id', controller['update']);
router.delete('/config/schedule/:id', controller['delete']);

module.exports = router;