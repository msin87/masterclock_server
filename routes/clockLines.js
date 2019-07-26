const express = require('express');
const controller = require('../config/controllers/clockLines');

const router = express.Router();

router.get('/clockLines', controller['all']);
router.get('/clockLines/:id', controller['findById']);
router.post('/clockLines', controller['push']);
router.put('/clockLines/:id', controller['update']);
router.delete('/clockLines/:id', controller['delete']);
router.get('/tuneClockLines', controller['tune']);
router.get('/tuneClockLines/:id', controller['tune']);
module.exports = router;