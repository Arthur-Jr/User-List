import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './controlledComponents/InputComponent.jsx';

function TextInputSection({
  textInputValue, radioValue, handleInputTextChange, blockStatus, setBlockStatus,
}) {
  return (
    <section>
      <InputComponent
        type="text"
        maxLength={ radioValue === 'cpf' ? 11 : 14 }
        value={ textInputValue }
        handle={ handleInputTextChange }
        placeholder="CPF/CNPJ"
        name="text-input"
        id="text-input"
      />

      <InputComponent
        type="checkbox"
        value={ blockStatus }
        handle={ () => setBlockStatus(!blockStatus) }
        text="Block"
        name="block-checkbox"
        id="block-checkbox"
      />
    </section>
  );
}

TextInputSection.propTypes = {
  textInputValue: PropTypes.string.isRequired,
  radioValue: PropTypes.string.isRequired,
  handleInputTextChange: PropTypes.func.isRequired,
  blockStatus: PropTypes.bool.isRequired,
  setBlockStatus: PropTypes.func.isRequired,
};

export default TextInputSection;
