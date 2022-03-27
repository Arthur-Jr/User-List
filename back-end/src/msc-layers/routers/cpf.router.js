const express = require('express');

const { registerCpfController } = require('../controllers/cpf.controller');

const router = express.Router();

router.post('/', registerCpfController);

module.exports = router;
