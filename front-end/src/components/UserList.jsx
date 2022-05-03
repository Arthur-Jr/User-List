import React from 'react';
import PropTypes from 'prop-types';

import InputComponent from './controlledComponents/InputComponent.jsx';

function UserList({ arrayToDisplay, handleEdit, handleRemove }) {
  return (
    <section className="user-list-section">
      {arrayToDisplay.map(({ user, blockListed, type }) => (
        <div key={ user } className="user-card" data-testid="card-div">
          <h4>{`${type === 'email' ? 'Email' : 'Username'}: ${user}`}</h4>

            <InputComponent
              id={ user }
              name="edit-checkbox"
              type="checkbox"
              value={ user }
              handle={ handleEdit }
              checked={ blockListed }
              text="Bloqueado"
            />

          <button type="button" onClick={ () => handleRemove(user) }>Remover</button>
        </div>
      ))}
    </section>
  );
}

UserList.propTypes = {
  arrayToDisplay: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default UserList;
