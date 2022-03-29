import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line object-curly-newline
function InputComponent({
  type, maxLength, value, handle, text, placeholder, name, id, checked,
}) {
  return (
    <label htmlFor={id} className={`${name}-label`}>
      <input
        id={id}
        name={name}
        type={ type }
        maxLength={ maxLength }
        value={ value }
        onChange={ handle }
        placeholder={ placeholder }
        defaultChecked={ checked }
      />
      {text}
    </label>
  );
}

InputComponent.defaultProps = {
  text: '',
  placeholder: '',
  maxLength: 14,
  checked: false,
};

InputComponent.propTypes = {
  type: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  handle: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
};

export default InputComponent;
