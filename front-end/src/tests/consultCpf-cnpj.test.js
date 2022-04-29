import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRouter from './renderWithRouter';
import cpfCnpjListMock from './cpfCnpjListMock';
import App from '../App';

jest.mock('axios');

const axiosGetMockResolved = (returnValue) => {
  axios.get.mockResolvedValue(returnValue);
};

const axiosPutMockResolved = (returnValue) => {
  axios.put.mockResolvedValue(returnValue);
};

const axiosDeleteMockResolved = (returnValue) => {
  axios.delete.mockResolvedValue(returnValue);
};

afterEach(() => {
  axios.mockRestore();
});

describe('Testes da página de consulta de CPF/CNPJ:', () => {
  describe('Testa se os elementos estão presentes na tela:', () => {
    beforeEach(async () => {
      axiosGetMockResolved({ data: { ...cpfCnpjListMock } });

      await act(async () => {
        renderWithRouter(<App />, { route: '/' });
      })
    });

    test('Deve conter 3 botões radio.', () => {
      const cpfCnpjRadio = screen.getByLabelText('CPF/CNPJ');
      const cpfRadio = screen.getByLabelText('CPF');
      const cnpjRadio = screen.getByLabelText('CNPJ');

      expect(cpfCnpjRadio).toBeInTheDocument();
      expect(cpfCnpjRadio.checked).toBe(true);
      expect(cpfRadio).toBeInTheDocument();
      expect(cnpjRadio).toBeInTheDocument();
    });

    test('Deve conter um input de texto', () => {
      const textInput = screen.getByPlaceholderText('CPF/CNPJ');
      expect(textInput).toBeInTheDocument();
    });

    test('Deve conter um checkbox', () => {
      const checkbox = screen.getByLabelText('Block');
      expect(checkbox).toBeInTheDocument();
    });

    test('Deve conter um link para adicionar novo CPF/CNPJ', () => {
      const link = screen.getByText('Adicionar novo CPF/CNPJ');
      expect(link).toBeInTheDocument();
    });

    test('Deve conter uma lista de CPF/CNPJ', () => {
      const cards = screen.getAllByTestId('card-div');
      const cardTitles = screen.getAllByRole('heading', { level: 4 });
      const editCheck = screen.getAllByLabelText('Bloqueado');
      const removeBnts = screen.getAllByText('Remover');

      expect(cards).toHaveLength(11);
      expect(editCheck).toHaveLength(11);
      expect(cardTitles).toHaveLength(11);
      expect(removeBnts).toHaveLength(11);

      cards.forEach((card, index) => {
        expect(card).toBeInTheDocument();
        expect(editCheck[index]).toBeInTheDocument();
        expect(cardTitles[index]).toBeInTheDocument();
        expect(removeBnts[index]).toBeInTheDocument();
      });
    });
  });

  describe('Teste das funcionalidades da página de consulta de CPF/CNPJ:', () => {
    describe('Testes relacionado ao radio input:', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: { ...cpfCnpjListMock } });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Deve conter apenas CPF quando o radio CPF está ativo', () => {
        const cpfRadio = screen.getByLabelText('CPF');
        userEvent.click(cpfRadio);

        const cards = screen.getAllByTestId('card-div');        
        expect(cards).toHaveLength(6);
      });

      test('Deve conter apenas CNPJ quando o radio CNPJ está ativo', () => {
        const cnpjRadio = screen.getByLabelText('CNPJ');
        userEvent.click(cnpjRadio);

        const cards = screen.getAllByTestId('card-div');        
        expect(cards).toHaveLength(5);
      });
    });

    describe('Testes relacionado ao text input e chekbox block:', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: { ...cpfCnpjListMock } });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Ao digitar no input a lista deve ser alterada de acordo com o valor do input', () => {
        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        userEvent.type(textInput, '837');

        const cards = screen.getAllByTestId('card-div');        
        expect(cards).toHaveLength(1);
      });

      test('Ao clicar no fitro do checkbox a lista deve ser alterada', () => {
        const checkbox = screen.getByLabelText('Block');
        userEvent.click(checkbox);

        let cards = screen.getAllByTestId('card-div');        
        expect(cards).toHaveLength(6);

        userEvent.click(checkbox);
        cards = screen.getAllByTestId('card-div');
        expect(cards).toHaveLength(11);
      });
    });

    describe('Testes relacionados a regra de nogocio de edição e remoção de CPF/CNPJ', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: { ...cpfCnpjListMock } });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Deve alterar o status quando o input de checkbox for clicado', async () => {
        axiosPutMockResolved({ data: { cpf: '24795932077', blockListed: false } });

        let editCheck = screen.getAllByLabelText('Bloqueado');
        expect(editCheck[0].checked).toBe(true);
        await act(async () => {
          userEvent.click(editCheck[0]);
        })

        editCheck = screen.getAllByLabelText('Bloqueado');
        expect(editCheck[0].checked).toBe(false);

        await act(async () => renderWithRouter(<App />, { route: '/' }));
        editCheck = screen.getAllByLabelText('Bloqueado');
        expect(editCheck[0].checked).toBe(false);
      });

      test('Deve remover o CPF/CNPJ da lista quando o botão remover for clicado ', async () => {
        axiosDeleteMockResolved({ data: { message: 'CPF removido com sucesso' } })
        const removeBnts = screen.getAllByText('Remover');

        const cardTitles = screen.getAllByRole('heading', { level: 4 });
        expect(cardTitles[0]).toBeInTheDocument();

        await act(async () => {
          userEvent.click(removeBnts[0]);
        });
        const responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('CPF removido com sucesso');
        expect(cardTitles[0]).not.toBeInTheDocument();

        await act(async () => renderWithRouter(<App />, { route: '/' }));
        expect(cardTitles[0]).not.toBeInTheDocument();
      });
    });

    describe('Teste do link de Adicionar novo CPF/CNPJ:', () => {
      test('Deve redirecionar para página de registro.', async () => {
        let HISTORY;

        await act(async () => {
          const { history } = renderWithRouter(<App />, { route: '/' });
          HISTORY = history;
        });

        const link = screen.getByText('Adicionar novo CPF/CNPJ');
        expect(link).toBeInTheDocument();

        userEvent.click(link);
        expect(HISTORY.location.pathname).toBe('/register-cpf-cnpj');
      });
    });
  });
});
