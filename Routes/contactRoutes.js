const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../Controller/contactController');

router.post('/contact', submitContactForm);

module.exports = router;
