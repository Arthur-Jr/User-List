import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import getAllCpfCnpj from '../api/getAll-cpf-cnpj';
import editCpfCnpj from '../api/edit-cpf-cnpj';
import removeCpfCnpj from '../api/remove-cpf-cnpj';
import getServerStatus from '../api/getServerStatus';
import RadioInputsSection from '../components/RadioInputsSection.jsx';
import BlockListRadioSection from '../components/BlockListRadioSection.jsx';
import TextInputSection from '../components/TextInputSection.jsx';
import sortList from '../utils/sortList';
import ListCpfCnpj from '../components/ListCpfCnpj.jsx';
import setMessageWithTime from '../utils/setMessageWithTimer';
import '../CSS/consultPage.scss';

function ConsultCpfCnpj() {
  const [allCpfCnpj, setAllCpfCnpj] = useState({ cpf: [], cnpj: [] });
  const [arrayToDisplay, setArrayToDisplay] = useState([]);
  const [radioValue, setRadioValue] = useState('cpf/cnpj');
  const [textInputValue, setTextInputValue] = useState('');
  const [blockStatus, setBlockStatus] = useState('all');
  const [responseMessage, setResponseMessage] = useState('');

  // Assim que o componente carrega Faz uma requisição para pegar a lista de CPF/CNPJ.
  useEffect(() => {
    getAllCpfCnpj().then((response) => setAllCpfCnpj(response));
  }, []);

  // Lida com os filtros:
  useEffect(() => {
    let toDisplay;

    // Filtro do radio input:
    if (radioValue === 'cpf/cnpj') {
      toDisplay = [...allCpfCnpj.cpf, ...allCpfCnpj.cnpj];
    } else {
      toDisplay = allCpfCnpj[radioValue];
    }

    // Filtro do text input:
    if (textInputValue.length > 0) {
      toDisplay = toDisplay.filter((cpfCpnj) => {
        const filterResult = cpfCpnj.cpf ? cpfCpnj.cpf.includes(textInputValue)
          : cpfCpnj.cnpj.includes(textInputValue);
        return filterResult;
      });
    }

    // Filtro do status do CPF/CNPJ:
    if (blockStatus === 'blocked') {
      toDisplay = toDisplay.filter(({ blockListed }) => blockListed);
    } else if (blockStatus === 'active') {
      toDisplay = toDisplay.filter(({ blockListed }) => !blockListed);
    }

    setArrayToDisplay(toDisplay);
  }, [radioValue, allCpfCnpj, textInputValue, blockStatus]);

  const handleInputTextChange = ({ target: { value } }) => {
    const onlyNumberRegex = /(^[0-9]*$)|([.-]*$)/;
    if (onlyNumberRegex.test(value)) setTextInputValue(value);
  };

  const handleEdit = async ({ target: { value, checked } }) => {
    const cpfOrCnpj = value.length === 11 ? 'cpf' : 'cnpj';
    const editedData = await editCpfCnpj(checked, value, cpfOrCnpj);

    if (editedData[cpfOrCnpj]) {
      const takeOutEdited = allCpfCnpj[cpfOrCnpj]
        .filter((data) => data[cpfOrCnpj] !== editedData[cpfOrCnpj]);

      const arrayWithEdited = sortList([...takeOutEdited, editedData], cpfOrCnpj);

      setAllCpfCnpj({ ...allCpfCnpj, [cpfOrCnpj]: arrayWithEdited });
    } else {
      setMessageWithTime(editedData, setResponseMessage, 5000);
    }
  };

  const handleRemove = async (cpfCnpjToRemove) => {
    const cpfOrCnpj = cpfCnpjToRemove.length === 11 ? 'cpf' : 'cnpj';
    const message = await removeCpfCnpj(cpfCnpjToRemove, cpfOrCnpj);

    const takeOutRemoved = allCpfCnpj[cpfOrCnpj]
      .filter((data) => data[cpfOrCnpj] !== cpfCnpjToRemove);

    setAllCpfCnpj({ ...allCpfCnpj, [cpfOrCnpj]: takeOutRemoved });

    setMessageWithTime(message, setResponseMessage, 5000);
  };

  // Checa o status do servidor:
  const handleServeButtonClick = async () => {
    const message = await getServerStatus();
    // eslint-disable-next-line no-alert
    alert(message);
  };

  return (
  <main className="consult-main">
    <section className="main-section">
      <section className="filter-section">
        <RadioInputsSection setRadioValue={ setRadioValue } registerPage={ false } />

        <section className="textInput-section">
          <TextInputSection
            textInputValue={ textInputValue }
            radioValue={ radioValue }
            handleInputTextChange={ handleInputTextChange }
          />

          <BlockListRadioSection
            setRadioValue={ setBlockStatus }
          />
        </section>

      <Link to="/register-cpf-cnpj">Adicionar novo CPF/CNPJ</Link>
      </section>

      <ListCpfCnpj
        arrayToDisplay={ arrayToDisplay }
        handleEdit={ handleEdit }
        handleRemove={ handleRemove }
      />

      { responseMessage.length !== 0
      && <span data-testid="response-message" className="message">{ responseMessage }</span> }
    </section>
    <button
      type="button"
      className="server-btn"
      onClick={ handleServeButtonClick }
    >Server status</button>
  </main>
  );
}

export default ConsultCpfCnpj;
