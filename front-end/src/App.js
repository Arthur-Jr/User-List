import { Route, Routes } from 'react-router-dom';

import RegisterUser from './pages/register-user.jsx';
import ConsultUserList from './pages/consult-cpf-cnpj.jsx';
import './CSS/app.scss';

function App() {
  return (
    <Routes>
      <Route path='/register-user' element={ <RegisterUser/> }/>
      <Route path='/' element={<ConsultUserList />} />
    </Routes>
  );
}

export default App;
