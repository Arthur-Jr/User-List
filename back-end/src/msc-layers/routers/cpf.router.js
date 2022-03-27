const express = require('express');

const {
  registerCpfController, editCpfController,
} = require('../controllers/cpf.controller');

const router = express.Router();

router.post('/', registerCpfController);
router.put('/:cpf', editCpfController);

module.exports = router;
