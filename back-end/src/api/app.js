const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const errorMiddleware = require('../middlewares/errorMiddleware');
const cpfRouter = require('../msc-layers/routers/cpf.router');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.use('/cpf', cpfRouter); /* Registro, edição e remoção de CPF */
// app.use('/cnpj');
// app.get('/cpf-cnpj-lists');

app.use(errorMiddleware);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
