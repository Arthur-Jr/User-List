import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './controlledComponents/InputComponent.jsx';

function TextInputSection({ textInputValue, handleInputTextChange }) {
  return (
    <InputComponent
      type="text"
      maxLength={ 30 }
      value={ textInputValue }
      handle={ handleInputTextChange }
      placeholder="Username/Email"
      name="text-input"
      id="text-input"
    />
  );
}

TextInputSection.propTypes = {
  textInputValue: PropTypes.string.isRequired,
  handleInputTextChange: PropTypes.func.isRequired,
};

export default TextInputSection;
