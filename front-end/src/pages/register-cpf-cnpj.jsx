import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as validator from 'cpf-cnpj-validator';

import registerData from '../api/register-cpf-cnpj';
import RadioInputsSection from '../components/RadioInputsSection.jsx';
import TextInputSection from '../components/TextInputSection.jsx';

function RegisterCpfCpnj() {
  const [radioValue, setRadioValue] = useState('cpf');
  const [textInputValue, setTextInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [blockStatus, setBlockStatus] = useState(false);
  const [btnStatus, setBtnStatus] = useState(true);

  // Checa se o CPF/CNPJ é valido e informa ao usuário:
  useEffect(() => {
    const validationResult = validator[radioValue].isValid(textInputValue);

    if (!validationResult && textInputValue.length > 0) {
      setResponseMessage(`${radioValue.toUpperCase()} inválido`);
      setBtnStatus(true);
    } else {
      setResponseMessage('');
    }

    if (validationResult) setBtnStatus(false);
  }, [textInputValue, setResponseMessage, radioValue]);

  // Certifica que o input de texto só vai aceitar números:
  const handleInputTextChange = ({ target: { value } }) => {
    const onlyNumberRegex = /(^[0-9]*$)|([.-]*$)/;
    if (onlyNumberRegex.test(value)) {
      setTextInputValue(validator[radioValue].format(value));
    }
  };

  // Faz a requisição para salvar o CPF/CNPJ no banco:
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToRegister = {
      [radioValue]: textInputValue.replace(/(\.)|(\/)|-/g, ''),
      blockListed: blockStatus,
    };
    const message = await registerData(dataToRegister, radioValue);
    setResponseMessage(message);

    const FIVE_SECONDS = 5000;
    setTimeout(() => setResponseMessage(''), FIVE_SECONDS);
  };

  return (
    <main>
      <h1>Registrar CPF/CNPJ</h1>

      <form onSubmit={ handleSubmit }>
        <RadioInputsSection setRadioValue={ setRadioValue } />

        <TextInputSection
          textInputValue={ textInputValue }
          radioValue={ radioValue }
          handleInputTextChange={ handleInputTextChange }
          blockStatus={ blockStatus }
          setBlockStatus={ setBlockStatus }
        />
        { responseMessage.length !== 0
        && <span data-testid="response-message">{ responseMessage }</span> }

        <button
          type="submit"
          disabled={ btnStatus }
        >
          Registrar
        </button>
      </form>

      <Link to="/">Consultar CPF/CNPJ</Link>
    </main>
  );
}

export default RegisterCpfCpnj;
