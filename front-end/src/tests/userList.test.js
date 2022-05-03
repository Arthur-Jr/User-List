import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRouter from './renderWithRouter';
import userListMock from './userListMock';
import App from '../App';

jest.mock('axios');

const TEXT_INPUT = 'Username/Email';
const ALL_TYPE_RADIO = 'Todos';
const USERNAME_RADIO = 'Username';
const EMAIL_RADIO = 'Email';
const BLOCKED_RADIO = 'Bloqueados';
const ACTIVE_RADIO = 'Ativo';
const CARD_DIV = 'card-div';
const EDIT_CHECKBOX = 'Bloqueado';
const REMOVE_BTN = 'Remover';
const RESPONSE_MESSAGE = 'response-message';

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

describe('Testes da página de lista de usuários:', () => {
  describe('Testa se os elementos estão presentes na tela:', () => {
    beforeEach(async () => {
      axiosGetMockResolved({ data: userListMock });

      await act(async () => {
        renderWithRouter(<App />, { route: '/' });
      })
    });

    test('Deve conter 3 botões radio para filtro de tipo.', () => {
      const allTypeRadio = screen.getAllByLabelText(ALL_TYPE_RADIO);
      const usernameRadio = screen.getByLabelText(USERNAME_RADIO);
      const emailRadio = screen.getByLabelText(EMAIL_RADIO);

      expect(allTypeRadio[0]).toBeInTheDocument();
      expect(allTypeRadio[0].checked).toBe(true);
      expect(usernameRadio).toBeInTheDocument();
      expect(emailRadio).toBeInTheDocument();
    });

    test('Deve conter um input de texto', () => {
      const textInput = screen.getByPlaceholderText(TEXT_INPUT);
      expect(textInput).toBeInTheDocument();
    });

    test('Deve conter 3 botões radio para filtro por status.', () => {
      const allRadio = screen.getAllByLabelText(ALL_TYPE_RADIO);
      const BlockedRadio = screen.getByLabelText(BLOCKED_RADIO);
      const ActiveRadio = screen.getByLabelText(ACTIVE_RADIO);

      expect(allRadio[1]).toBeInTheDocument();
      expect(allRadio[1].checked).toBe(true);
      expect(BlockedRadio).toBeInTheDocument();
      expect(ActiveRadio).toBeInTheDocument();
    });

    test('Deve conter um link para adicionar um novo usuário', () => {
      const link = screen.getByText('Adicionar novo Username/Email');
      expect(link).toBeInTheDocument();
    });

    test('Deve conter uma lista de usuários', () => {
      const cards = screen.getAllByTestId(CARD_DIV);
      const cardTitles = screen.getAllByRole('heading', { level: 4 });
      const editCheck = screen.getAllByLabelText(EDIT_CHECKBOX);
      const removeBnts = screen.getAllByText(REMOVE_BTN);

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

  describe('Teste das funcionalidades da página de lista de usuários:', () => {
    describe('Testes relacionado ao radio input de tipo:', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: userListMock });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Deve conter apenas username quando o radio username está ativo', () => {
        const usernameRadio = screen.getByLabelText(USERNAME_RADIO);
        userEvent.click(usernameRadio);

        const cards = screen.getAllByTestId(CARD_DIV);
        expect(cards).toHaveLength(6);
      });

      test('Deve conter apenas email quando o radio email está ativo', () => {
        const emailRadio = screen.getByLabelText(EMAIL_RADIO);
        userEvent.click(emailRadio);

        const cards = screen.getAllByTestId(CARD_DIV);        
        expect(cards).toHaveLength(5);
      });
    });

    describe('Testes relacionado ao text input:', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: userListMock });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Ao digitar no input a lista deve ser alterada de acordo com o valor do input', () => {
        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        userEvent.type(textInput, 'joa');

        const cards = screen.getAllByTestId(CARD_DIV);        
        expect(cards).toHaveLength(1);
      });
    });

    describe('Testes relacionado ao radio input de status:', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: userListMock });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Deve conter todos os usuários quando o radio de status "Todos" está ativo', () => {
        const allRadio = screen.getAllByLabelText(ALL_TYPE_RADIO);
        userEvent.click(allRadio[1]);

        const cards = screen.getAllByTestId(CARD_DIV);        
        expect(cards).toHaveLength(11);
      });

      test('Deve conter apenas usuários bloqueados quando o radio "Bloqueados" está ativo', () => {
        const blockedRadio = screen.getByLabelText(BLOCKED_RADIO);
        userEvent.click(blockedRadio);

        const cards = screen.getAllByTestId(CARD_DIV);        
        expect(cards).toHaveLength(6);
      });

      test('Deve conter apenas usuários Ativo quando o radio "Ativo" está ativo', () => {
        const activeRadio = screen.getByLabelText(ACTIVE_RADIO);
        userEvent.click(activeRadio);

        const cards = screen.getAllByTestId(CARD_DIV);        
        expect(cards).toHaveLength(5);
      });
    });

    describe('Testes relacionados a regra de nogocio de edição e remoção de usuário', () => {
      beforeEach(async () => {
        axiosGetMockResolved({ data: userListMock });
  
        await act(async () => {
          renderWithRouter(<App />, { route: '/' });
        })
      });

      test('Deve alterar o status quando o input de checkbox for clicado', async () => {
        axiosPutMockResolved({ data: { user: 'atest', blockListed: false } });

        let editCheck = screen.getAllByLabelText(EDIT_CHECKBOX);
        expect(editCheck[0].checked).toBe(true);
        await act(async () => {
          userEvent.click(editCheck[0]);
        })

        editCheck = screen.getAllByLabelText(EDIT_CHECKBOX);
        expect(editCheck[0].checked).toBe(false);

        await act(async () => renderWithRouter(<App />, { route: '/' }));
        editCheck = screen.getAllByLabelText(EDIT_CHECKBOX);
        expect(editCheck[0].checked).toBe(false);
      });

      test('Deve remover o usuário da lista quando o botão remover for clicado ', async () => {
        axiosDeleteMockResolved({ data: { message: 'Usuário removido com sucesso' } })
        const removeBnts = screen.getAllByText(REMOVE_BTN);

        const cardTitles = screen.getAllByRole('heading', { level: 4 });
        expect(cardTitles[0]).toBeInTheDocument();

        await act(async () => {
          userEvent.click(removeBnts[0]);
        });
        const responseMessage = screen.getByTestId(RESPONSE_MESSAGE);
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('Usuário removido com sucesso');
        expect(cardTitles[0]).not.toBeInTheDocument();

        await act(async () => renderWithRouter(<App />, { route: '/' }));
        expect(cardTitles[0]).not.toBeInTheDocument();
      });
    });

    describe('Teste do link de Adicionar novo usuário:', () => {
      test('Deve redirecionar para página de registro de usuário.', async () => {
        let HISTORY;

        await act(async () => {
          const { history } = renderWithRouter(<App />, { route: '/' });
          HISTORY = history;
        });

        const link = screen.getByText('Adicionar novo Username/Email');
        expect(link).toBeInTheDocument();

        userEvent.click(link);
        expect(HISTORY.location.pathname).toBe('/register-user');
      });
    });
  });
});
