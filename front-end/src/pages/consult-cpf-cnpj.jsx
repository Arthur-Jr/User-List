import React, { useEffect, useState } from 'react';

import getAllCpfCnpj from '../api/getAll-cpf-cnpj';
import RadioInputsSection from '../components/RadioInputsSection.jsx';

function ConsultCpfCnpj() {
  const [allCpfCnpj, setAllCpfCnpj] = useState({ cpf: [], cnpj: [] });
  const [arrayToDisplay, setArrayToDisplay] = useState([]);
  const [radioValue, setRadioValue] = useState('cpf/cnpj');

  useEffect(() => {
    getAllCpfCnpj().then((response) => setAllCpfCnpj(response));
  }, []);

  useEffect(() => {
    if (radioValue === 'cpf/cnpj') {
      setArrayToDisplay([...allCpfCnpj.cpf, ...allCpfCnpj.cnpj]);
    } else {
      setArrayToDisplay(allCpfCnpj[radioValue]);
    }
  }, [radioValue, allCpfCnpj]);

  return (
  <main>
    <RadioInputsSection setRadioValue={ setRadioValue } registerPage={ false } />
  </main>
  );
}

export default ConsultCpfCnpj;
