import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as validator from 'cpf-cnpj-validator';

import registerData from '../api/register-cpf-cnpj';
import RadioInputSection from '../components/RadioInputSection.jsx';
import InputComponent from '../components/controlledComponents/InputComponent.jsx';
import TextInputSection from '../components/TextInputSection.jsx';
import setMessageWithTime from '../utils/setMessageWithTimer';
import { typeFilterRadio } from '../utils/radioInputsInfos';
import '../CSS/registerPage.scss';

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

  const handleInputTextChange = ({ target: { value } }) => {
    const onlyNumberRegex = /(^[0-9]*$)|([.-]*$)/;
    if (onlyNumberRegex.test(value)) {
      setTextInputValue(validator[radioValue].format(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToRegister = {
      [radioValue]: textInputValue.replace(/(\.)|(\/)|-/g, ''),
      blockListed: blockStatus,
    };
    const message = await registerData(dataToRegister, radioValue);

    const FIVE_SECONDS = 5000;
    setMessageWithTime(message, setResponseMessage, FIVE_SECONDS);
  };

  return (
    <main className="register-main">
      <section className="main-section">
        <h1 className="title">Registrar CPF/CNPJ</h1>

        <form onSubmit={ handleSubmit }>
          <RadioInputSection
            radios={[typeFilterRadio[1], typeFilterRadio[2]]}
            setRadioValue={ setRadioValue }
            classN="radio-section"
          />

          <section className="textInput-section">
            <TextInputSection
              textInputValue={ textInputValue }
              radioValue={ radioValue }
              handleInputTextChange={ handleInputTextChange }
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
      </section>
    </main>
  );
}

export default RegisterCpfCpnj;
