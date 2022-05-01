const joi = require('joi');

const { BAD_REQUEST } = require('../../../utils/http_code_status');
const errorThrow = require('../../../utils/errorThrow');
const errorMessage = require('../../../utils/errorMessages');

const checkUsernameToRegisterPayload = (Payload) => {
  const { error } = joi.object({
    user: joi.string().min(5).required(),
    blockListed: joi.bool().required(),
  }).validate(Payload);
  if (error) errorThrow(BAD_REQUEST, `Username ${errorMessage.invalid}`);
};

const checkEmailToRegisterPayload = (Payload) => {
  const { error } = joi.object({
    user: joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    blockListed: joi.bool().required(),
  }).validate(Payload);
  if (error) errorThrow(BAD_REQUEST, `Email ${errorMessage.invalid}`);
};

const checkUserPayload = (userToEdit) => {
  const userSchema = joi.string().min(3).required();
  const { error } = userSchema.validate(userToEdit);
  if (error) errorThrow(BAD_REQUEST, `Usuário ${errorMessage.invalid}`);
};

module.exports = {
  checkUsernameToRegisterPayload,
  checkEmailToRegisterPayload,
  checkUserPayload,
};
