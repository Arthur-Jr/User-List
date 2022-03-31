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
git clone git@github.com:Arthur-Jr/neoway-teste.git
```

<br>

## Instalando Dependências
  - Essa parte não é nescessaria se for rodar com docker!

Front-end:
```bash
cd neoway-teste/front-end && npm install
``` 

Back-end:
```bash
cd neoway-teste/back-end && npm install
``` 

<br>

## Executando aplicação
  ### Com Docker:

  Na Raiz do projeto:

  ```bash
  cd npm run compose:up
  ``` 

  Para parar aplicação

  ```bash
  cd npm run compose:down
  ```

  <br>

  ### Sem Docker:

  Front-end:
  ```bash
  cd neoway-teste/front-end && npm start
  ``` 

  Back-end:
  ```bash
  cd neoway-teste/back-end && npm start
  ``` 

<br>


## Executando Testes

* Para rodar todos os testes:

  Front-end:
  ```bash
  cd neoway-teste/front-end && npm test
  ``` 

  Back-end:

  É nescessario que a porta 3001 esteja livre para rodar o test do back-end, então nem o docker nem o npm start podem estar ativos. 
  ```bash
  cd neoway-teste/back-end && npm test
  ``` 
