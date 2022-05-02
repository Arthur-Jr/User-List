import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import registerData from '../api/register-user-on-list';
import RadioInputSection from '../components/RadioInputSection.jsx';
import InputComponent from '../components/controlledComponents/InputComponent.jsx';
import TextInputSection from '../components/TextInputSection.jsx';
import setMessageWithTime from '../utils/setMessageWithTimer';
import { typeFilterRadio } from '../utils/radioInputsInfos';
import '../CSS/registerPage.scss';

function RegisterUser() {
  const [radioValue, setRadioValue] = useState('Username');
  const [textInputValue, setTextInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [blockStatus, setBlockStatus] = useState(false);
  const [btnStatus, setBtnStatus] = useState(true);

  // Checa se o username/email é valido e informa ao usuário:
  useEffect(() => {
    const emailCheck = /^\w+@+[a-z0-9]+\.+[a-z]+\.*([a-z]+)?$/.test(textInputValue);
    const optionalCheck = radioValue === 'Email' ? emailCheck : true;

    if (textInputValue.length < 5 || !optionalCheck) {
      setResponseMessage(`${radioValue} inválido`);
      setBtnStatus(true);
    } else {
      setResponseMessage('');
      setBtnStatus(false);
    }
  }, [textInputValue, setResponseMessage, radioValue]);

  const handleInputTextChange = ({ target: { value } }) => {
    const alphaNumRegex = /^\w*$/;
    const emailRegex = /^\w*@*[a-z0-9]*\.*[a-z]*\.*([a-z]*)?$/;
    const regex = radioValue === 'Email' ? emailRegex : alphaNumRegex;

    if (regex.test(value)) {
      setTextInputValue(value);
    }
  };

  const handleRadioValueChange = (value) => {
    setRadioValue(value);
    setTextInputValue('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToRegister = {
      user: textInputValue,
      blockListed: blockStatus,
    };
    const message = await registerData(dataToRegister, radioValue);

    const THREE_SECONDS = 3000;
    setMessageWithTime(message, setResponseMessage, THREE_SECONDS);
  };

  return (
    <main className="register-main">
      <section className="main-section">
        <h1 className="title">Registrar Username/Email</h1>

        <form onSubmit={ handleSubmit }>
          <RadioInputSection
            radios={[typeFilterRadio[1], typeFilterRadio[2]]}
            setRadioValue={ handleRadioValueChange }
            classN="radio-section"
          />

          <section className="textInput-section">
            <TextInputSection
              textInputValue={ textInputValue }
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

        <Link to="/">Lista de Usuários</Link>
      </section>
    </main>
  );
}

export default RegisterUser;
