import { Route, Routes } from 'react-router-dom';

import RegisterCpfCpnj from './pages/register-cpf-cnpj.jsx';
import './CSS/app.scss';

function App() {
  return (
    <Routes>
      <Route path='/register-cpf-cnpj' element={ <RegisterCpfCpnj/> }/>
    </Routes>
  );
}

export default App;
