import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './controlledComponents/InputComponent.jsx';

function TextInputSection({ textInputValue, radioValue, handleInputTextChange }) {
  return (
    <InputComponent
      type="text"
      maxLength={ radioValue === 'cpf' ? 11 : 14 }
      value={ textInputValue }
      handle={ handleInputTextChange }
      placeholder="CPF/CNPJ"
      name="text-input"
      id="text-input"
    />
  );
}

TextInputSection.propTypes = {
  textInputValue: PropTypes.string.isRequired,
  radioValue: PropTypes.string.isRequired,
  handleInputTextChange: PropTypes.func.isRequired,
};

export default TextInputSection;
