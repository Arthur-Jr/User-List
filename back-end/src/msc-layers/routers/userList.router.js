const express = require('express');

const {
  registerUsernameController,
  registerEmailController,
  editUserStatusController,
  removeUserController,
  getAllUsersController,
} = require('../controllers/userList.controller');

const router = express.Router();

router.get('/', getAllUsersController);
router.post('/username', registerUsernameController);
router.post('/email', registerEmailController);
router.put('/:id', editUserStatusController);
router.delete('/:id', removeUserController);

module.exports = router;
