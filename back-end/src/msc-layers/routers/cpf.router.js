const express = require('express');

const {
  registerCpfController, editCpfController, removeCpfController,
} = require('../controllers/cpf.controller');

const router = express.Router();

router.post('/', registerCpfController);
router.put('/:cpf', editCpfController);
router.delete('/:cpf', removeCpfController);

module.exports = router;
