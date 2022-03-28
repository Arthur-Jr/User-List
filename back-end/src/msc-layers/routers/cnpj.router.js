const express = require('express');

const {
  registerCnpjController, editCnpjController, removeCnpjController,
} = require('../controllers/cnpj.controller');

const router = express.Router();

router.post('/', registerCnpjController);
router.put('/:cnpj', editCnpjController);
router.delete('/:cnpj', removeCnpjController);

module.exports = router;
