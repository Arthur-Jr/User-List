const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const errorMiddleware = require('../middlewares/errorMiddleware');
const cpfRouter = require('../msc-layers/routers/cpf.router');
const cnpjRouter = require('../msc-layers/routers/cnpj.router');
const { getAllCpfCnpjList } = require('../msc-layers/controllers/getList.controller');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.use('/cpf', cpfRouter); /* Registro, edição e remoção de CPF */
app.use('/cnpj', cnpjRouter); /* Registro, edição e remoção de CNPJ */
app.get('/cpf-cnpj-lists', getAllCpfCnpjList); /* Consulta de todos CPF/CNPJ */

app.use(errorMiddleware);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
