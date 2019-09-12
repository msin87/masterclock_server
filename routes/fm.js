const express = require('express');
const config = require('../config/controllers/fm');

const router = express.Router();


router.get('/fm', config['all']);
router.get('/fm/:id', config['findById']);
router.get('/fm/setFreq/:freq', config['setFreq']);
router.post('/fm', config['push']);
router.put('/fm/:id', config['update']);
router.delete('/fm/:id', config['delete']);

module.exports = router;