# Contexto
Teste Técnico da neoway. Foi desenvolvido um CRUD/validador de CPF/CNPJ, onde é possivel adicionar, remover, editar e deletar.

## Técnologias usadas

Front-end:
  - JavaScript
  - React.js
  - RTL(tests)
  - Sass

Back-end:
  - JavaScript
  - Node.js
  - Express
  - MongoDB
  - Tests(Mocha, Sinon, Chai)
  - Joi

<br>

## Clonando o projeto

Copie e cole em seu terminal:

```
git clone git@github.com:Arthur-Jr/neoway-teste.git && cd neoway-teste/
```

<br>

## Todos os comandos abaixo precisam ser executados na raiz do projeto!

## Instalando Dependências
  - Essa parte não é nescessaria se for rodar com docker!

Front-end:
```bash
cd front-end/ && npm install
``` 

Back-end:
```bash
cd back-end/ && npm install
``` 

<br>

## Executando aplicação
  ### Com Docker:

  Portas do docker:
  - front: 3000:3000
  - back: 3001:3001
  - mongo: 3002:27017 

  <br>
  Iniciando o app:
  
  ```bash
  npm run compose:up
  ``` 

  A aplicação vai estar rodando no link http://localhost:3000/

  <br>
  Para parar o app:

  ```bash
  npm run compose:down
  ```

  <br>

  ### Sem Docker:

  Back-end:
    
  - O MongoDb deve está ativo para o back-end funcionar!

  ```bash
  cd back-end/ && npm start
  ``` 

  Front-end:

  ```bash
  cd front-end/ && npm start
  ``` 

<br>


## Executando Testes

* Para rodar todos os testes:

  Front-end:
  ```bash
  cd front-end/ && npm test
  ``` 

  Back-end:

  É nescessario que a porta 3001 esteja livre para rodar o test do back-end, então nem o docker nem o npm start podem estar ativos. 
  ```bash
  cd back-end/ && npm test
  ``` 
