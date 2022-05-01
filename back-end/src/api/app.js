const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerJson = require('../../swagger.json');
const errorMiddleware = require('../middlewares/errorMiddleware');
const userListRouter = require('../msc-layers/routers/userList.router');
const incrementReqCountController = require('../middlewares/IncrementReqCountMiddleware');
const {
  setServerStatusController,
  getServerStatusController,
} = require('../msc-layers/controllers/serverStatus.controller');
const insertOnStart = require('./insertOnStart');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/status', getServerStatusController); /* Consultar o status do server */
app.use(incrementReqCountController); /* Incrementa o número de req */
app.use('/user-list', userListRouter); /* Registro, edição e remoção de Usuários */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson)); /* Documentação da API */

app.use(errorMiddleware);

insertOnStart(); /* Se o BD estive vazio ele é populado */
setServerStatusController(); /* Salva a data em que o server foi iniciado */
app.listen(port, async () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
