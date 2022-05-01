import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './controlledComponents/InputComponent.jsx';

function RadioInputSection({ radios, setRadioValue, classN }) {
  return (
    <section className={classN}>
      {radios.map((radio) => (
        <InputComponent
          key={radio.value}
          type="radio"
          id={radio.value}
          name={radio.name}
          value={radio.value}
          handle={ ({ target }) => setRadioValue(target.value) }
          text={radio.text}
          checked={ radio.checked }
        />
      ))}
    </section>
  );
}

RadioInputSection.propTypes = {
  radios: PropTypes.arrayOf(PropTypes.object).isRequired,
  classN: PropTypes.string.isRequired,
  setRadioValue: PropTypes.func.isRequired,
};

export default RadioInputSection;
