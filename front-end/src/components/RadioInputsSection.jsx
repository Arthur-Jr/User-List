import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './controlledComponents/InputComponent.jsx';

function RadioInputsSection({ setRadioValue, registerPage }) {
  const displayAllOptions = () => (
    <InputComponent
      type="radio"
      id="cpf/cnpj-radio"
      name="CPF/CNPJ-radio"
      value="cpf/cnpj"
      handle={ ({ target }) => setRadioValue(target.value) }
      text="CPF/CNPJ"
      checked={ registerPage }
    />
  );

  return (
    <section>
      <InputComponent
        type="radio"
        id="cpf-radio"
        name="CPF/CNPJ-radio"
        value="cpf"
        handle={ ({ target }) => setRadioValue(target.value) }
        text="CPF"
        checked={ registerPage }
      />

      <InputComponent
        type="radio"
        id="cnpj-radio"
        name="CPF/CNPJ-radio"
        value="cnpj"
        handle={ ({ target }) => setRadioValue(target.value) }
        text="CNPJ"
      />

      {!registerPage && displayAllOptions()}
    </section>
  );
}

RadioInputsSection.defaultProps = {
  registerPage: true,
};

RadioInputsSection.propTypes = {
  setRadioValue: PropTypes.func.isRequired,
  registerPage: PropTypes.bool,
};

export default RadioInputsSection;
