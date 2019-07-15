const express = require('express');
const controller = require('../config/controllers/schedule');

const router = express.Router();

router.get('/schedule', controller['all']);
router.get('/schedule/:id', controller['findById']);
router.post('/schedule', controller['push']);
router.put('/schedule/:id', controller['update']);
router.delete('/schedule/:id', controller['delete']);

module.exports = router;