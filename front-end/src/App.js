import { Route, Routes } from 'react-router-dom';
import RegisterCpfCpnj from './pages/register-cpf-cnpj';

function App() {
  return (
    <Routes>
      <Route path='/register-cpf-cnpj' element={ <RegisterCpfCpnj/> }/>
    </Routes>
  );
}

export default App;
