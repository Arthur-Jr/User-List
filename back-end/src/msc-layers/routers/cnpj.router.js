const express = require('express');

const { registerCnpjController } = require('../controllers/cnpj.controller');

const router = express.Router();

router.post('/', registerCnpjController);
// router.put('/:cnpj');
// router.delete('/:cnpj');

module.exports = router;
