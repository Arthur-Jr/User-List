import React from 'react';

import InputComponent from './controlledComponents/InputComponent.jsx';

function BlockListRadioSection({ setRadioValue }) {
  return (
    <section className="radio-section">
      <InputComponent
        type="radio"
        id="all-radio"
        name="status-radio"
        value="all"
        handle={ ({ target }) => setRadioValue(target.value) }
        text="Todos"
        checked={ true }
      />

      <InputComponent
        type="radio"
        id="blocked-radio"
        name="status-radio"
        value="blocked"
        handle={ ({ target }) => setRadioValue(target.value) }
        text="Bloqueado"
      />

      <InputComponent
        type="radio"
        id="active-radio"
        name="status-radio"
        value="active"
        handle={ ({ target }) => setRadioValue(target.value) }
        text="Ativo"
      />
    </section>
  );
}

export default BlockListRadioSection;
