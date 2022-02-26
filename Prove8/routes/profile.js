const express = require('express');

const feedController = require('../controllers/profile');

const router = express.Router();

// GET /feed/posts
router.get('/professional', feedController.getProfile);

module.exports = router;