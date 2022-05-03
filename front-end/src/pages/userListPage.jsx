import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import getAllUsers from '../api/getAllUsers';
import editUserStatus from '../api/editUserStatus';
import removeUser from '../api/removeUser';
import getServerStatus from '../api/getServerStatus';
import RadioInputSection from '../components/RadioInputSection.jsx';
import TextInputSection from '../components/TextInputSection.jsx';
import sortList from '../utils/sortList';
import UserList from '../components/UserList.jsx';
import setMessageWithTime from '../utils/setMessageWithTimer';
import { sortRadio, statusRadio, typeFilterRadio } from '../utils/radioInputsInfos';
import '../CSS/userListPage.scss';

function UsersList() {
  const [allUsers, setAllUsers] = useState([]);
  const [arrayToDisplay, setArrayToDisplay] = useState([]);
  const [radioValue, setRadioValue] = useState('Username/Email');
  const [textInputValue, setTextInputValue] = useState('');
  const [blockStatus, setBlockStatus] = useState('all');
  const [sort, setSortValue] = useState('asc');
  const [responseMessage, setResponseMessage] = useState('');

  // Assim que o componente carrega Faz uma requisição para pegar a lista de usuários.
  useEffect(() => {
    getAllUsers().then((response) => setAllUsers(response));
  }, []);

  // Lida com os filtros e o sort:
  useEffect(() => {
    let toDisplay = sortList(allUsers, sort);

    // Filtro do radio input:
    if (radioValue !== 'Username/Email') {
      toDisplay = allUsers.filter(({ type }) => type === radioValue.toLowerCase());
    }

    // Filtro do text input:
    toDisplay = toDisplay.filter(({ user }) => user.includes(textInputValue));

    // Filtro do status do Username/Email:
    if (blockStatus === 'blocked') {
      toDisplay = toDisplay.filter(({ blockListed }) => blockListed);
    } else if (blockStatus === 'active') {
      toDisplay = toDisplay.filter(({ blockListed }) => !blockListed);
    }

    setArrayToDisplay(toDisplay);
  }, [radioValue, allUsers, textInputValue, blockStatus, sort]);

  const handleInputTextChange = ({ target: { value } }) => {
    const alphaNumRegex = /^\w*$/;
    if (alphaNumRegex.test(value)) setTextInputValue(value);
  };

  const handleEdit = async ({ target: { value, checked } }) => {
    const editedData = await editUserStatus(checked, value);

    if (editedData) {
      const takeOutEdited = allUsers.filter(({ user }) => user !== editedData.user);
      setAllUsers([...takeOutEdited, editedData]);
    } else {
      setMessageWithTime(editedData, setResponseMessage, 3000);
    }
  };

  const handleRemove = async (userToRemove) => {
    const message = await removeUser(userToRemove);

    const takeOutRemoved = allUsers.filter(({ user }) => user !== userToRemove);
    setAllUsers(takeOutRemoved);

    setMessageWithTime(message, setResponseMessage, 3000);
  };

  // Checa o status do servidor:
  const handleServerButtonClick = async () => {
    const message = await getServerStatus();
    // eslint-disable-next-line no-alert
    alert(message);
  };

  return (
  <main className="consult-main">
    <section className="main-section">
      <section className="filter-section">
        <RadioInputSection
          radios={typeFilterRadio}
          setRadioValue={ setRadioValue }
          classN="radio-section"
        />

        <RadioInputSection
          radios={sortRadio}
          setRadioValue={ setSortValue }
          classN="sort-radio-section"
        />

        <section className="textInput-section">
          <TextInputSection
            textInputValue={ textInputValue }
            radioValue={ radioValue }
            handleInputTextChange={ handleInputTextChange }
          />

          <RadioInputSection
            radios={statusRadio}
            setRadioValue={ setBlockStatus }
            classN="radio-section"
          />
        </section>

      <Link to="/register-user">Adicionar novo Username/Email</Link>
      </section>

      { arrayToDisplay.length > 0
      && <span className="array-length">{ arrayToDisplay.length }</span>}

      <UserList
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
      onClick={ handleServerButtonClick }
    >Server status</button>
  </main>
  );
}

export default UsersList;
