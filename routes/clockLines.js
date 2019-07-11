const express = require('express');
const controller = require('../config/controllers/clockLines');

const router = express.Router();

router.get('/config/clockLines', controller['all']);
router.get('/config/clockLines/:id', controller['findById']);
router.post('/config/clockLines', controller['push']);
router.put('/config/clockLines/:id', controller['update']);
router.delete('/config/clockLines/:id', controller['delete']);

module.exports = router;