const express = require('express');
const config = require('../config/controllers/clockLines');

const router = express.Router();

router.get('/clockLines', config['all']);
router.get('/clockLines/:id', config['findById']);
router.post('/clockLines', config['push']);
router.put('/clockLines/:id', config['update']);
router.delete('/clockLines/:id', config['delete']);
router.get('/tuneClockLines', config['tune']);
router.get('/tuneClockLines/:id', config['tune']);
module.exports = router;