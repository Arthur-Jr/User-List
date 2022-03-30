import React from 'react';
import PropTypes from 'prop-types';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';

import InputComponent from './controlledComponents/InputComponent.jsx';

function ListCpfCnpj({ arrayToDisplay, handleEdit, handleRemove }) {
  return (
    <section>
      {arrayToDisplay.map(({ cpf, cnpj, blockListed }) => {
        const cpfOrCnpj = cpf || cnpj;
        const displayFormat = cpf ? cpfValidator.format(cpf) : cnpjValidator.format(cnpj);
        return (
          <div key={ cpfOrCnpj } className="cpf-cnpj-card">
            <h4>{`${cpf ? 'CPF' : 'CNPJ'}: ${displayFormat}`}</h4>

              <InputComponent
                id="edit-checkbox"
                name="edit-checkbox"
                type="checkbox"
                value={ cpfOrCnpj }
                handle={ handleEdit }
                checked={ blockListed }
                text="Bloqueado"
              />

            <button type="button" onClick={ () => handleRemove(cpfOrCnpj) }>Remover</button>
          </div>
        );
      })}
    </section>
  );
}

ListCpfCnpj.propTypes = {
  arrayToDisplay: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default ListCpfCnpj;
