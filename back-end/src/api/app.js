const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const errorMiddleware = require('../middlewares/errorMiddleware');
const cpfRouter = require('../msc-layers/routers/cpf.router');
const cnpjRouter = require('../msc-layers/routers/cnpj.router');
const { getAllCpfCnpjList } = require('../msc-layers/controllers/getList.controller');
const incrementReqCountController = require('../middlewares/IncrementReqCountMiddleware');
const {
  setServerStatusController,
  getServerStatusController,
} = require('../msc-layers/controllers/serverStatus.controller');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/status', getServerStatusController); /* Consultar o status do server */

app.use(incrementReqCountController); /* Incrementa o número de req */

app.use('/cpf', cpfRouter); /* Registro, edição e remoção de CPF */
app.use('/cnpj', cnpjRouter); /* Registro, edição e remoção de CNPJ */
app.get('/cpf-cnpj-lists', getAllCpfCnpjList); /* Consulta de todos CPF/CNPJ */

app.use(errorMiddleware);

setServerStatusController(); /* Salva a data em que o server foi iniciado */
app.listen(port, async () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
