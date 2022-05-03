import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRouter from './renderWithRouter';
import App from '../App';

jest.mock('axios');

const USERNAME_EXAMPLE = 'test01';
const EMAIL_EXAMPLE = 'test02@email.com';

const TEXT_INPUT = 'Username/Email';
const USERNAME_RADIO = 'Username';
const EMAIL_RADIO = 'Email';
const RESPONSE_MESSAGE = 'response-message';
const REGISTER_BUTTON = /registrar/i;

const axiosPostMockResolved = (returnValue) => {
  axios.post.mockResolvedValue(returnValue);
};

const axiosPostMockRejected = (returnValue) => {
  axios.post.mockRejectedValue(returnValue);
};

afterAll(() => {
  axios.mockRestore();
});

describe('Testes da página de registro de Username/Email:', () => {
  describe('Testa se os elementos estão presentes na tela:', () => {
    beforeEach(() => {
      renderWithRouter(<App />, { route: '/register-user' });
    });

    test('Deve conter o título "Registrar Username/Email"', () => {
      const title = screen.getByRole('heading', { level: 1, name: /registrar username\/email/i });
      expect(title).toBeInTheDocument();
    });

    test('Deve conter 2 botões radio.', () => {
      const usernameRadio = screen.getByLabelText(USERNAME_RADIO);
      const emailRadio = screen.getByLabelText(EMAIL_RADIO);
      expect(usernameRadio).toBeInTheDocument();
      expect(emailRadio).toBeInTheDocument();
    });

    test('Deve conter um input de texto', () => {
      const textInput = screen.getByPlaceholderText(TEXT_INPUT);
      expect(textInput).toBeInTheDocument();
    });

    test('Deve conter um checkbox', () => {
      const checkbox = screen.getByLabelText('Block');
      expect(checkbox).toBeInTheDocument();
    });

    test('Deve conter um botão.', () => {
      const button = screen.getByRole('button', { name: REGISTER_BUTTON });
      expect(button).toBeInTheDocument();
      expect(button.disabled).toBe(true);
    });

    test('Deve conter um link para a lista de usuários', () => {
      const link = screen.getByText('Lista de Usuários');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Teste das funcionalidades da página de registro de Username/Email.', () => {
    describe('Testes relacionado ao Username:', () => {
      beforeEach(() => {
        renderWithRouter(<App />, { route: '/register-user' });
      });

      test('Quando o Username é Inválido', () => {
        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        userEvent.type(textInput, 'abc');
        const button = screen.getByRole('button', { name: REGISTER_BUTTON });

        const erroMessage = screen.getByTestId(RESPONSE_MESSAGE);
        expect(erroMessage).toBeInTheDocument();
        expect(erroMessage.innerHTML).toBe('Username inválido');
        expect(button.disabled).toBe(true);
      });

      test('Quando o Username é Valido', async () => {
        axiosPostMockResolved({ data: { id: 'idMock' } });
        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        let button = screen.getByRole('button', { name: REGISTER_BUTTON });

        expect(button.disabled).toBe(true);
        userEvent.type(textInput, USERNAME_EXAMPLE);

        let responseMessage = screen.queryByTestId(RESPONSE_MESSAGE);
        expect(responseMessage).toBe(null);

        button = screen.getByRole('button', { name: REGISTER_BUTTON });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        responseMessage = screen.getByTestId(RESPONSE_MESSAGE);
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('Username registrado com sucesso');
        setTimeout(() => {
          expect(responseMessage).not.toBeInTheDocument();
        }, 5000);
      });

      test('Quando o Username é valido mas já está registrado', async () => {
        axiosPostMockRejected({ response: { data: { message: 'Username já registrado' } } });
        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        userEvent.type(textInput, USERNAME_EXAMPLE);

        const button = screen.getByRole('button', { name: REGISTER_BUTTON });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        const responseMessage = screen.getByTestId(RESPONSE_MESSAGE);

        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('Username já registrado');
      });
    });

    describe('Testes relacionado ao Email:', () => {
      beforeEach(() => {
        renderWithRouter(<App />, { route: '/register-user' });
      });

      test('Quando o Email é Inválido', () => {
        const emailRadio = screen.getByLabelText(EMAIL_RADIO);
        userEvent.click(emailRadio);

        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        const button = screen.getByRole('button', { name: REGISTER_BUTTON });
        userEvent.type(textInput, 'abc@');

        const erroMessage = screen.getByTestId(RESPONSE_MESSAGE);
        expect(erroMessage).toBeInTheDocument();
        expect(erroMessage.innerHTML).toBe('Email inválido');
        expect(button.disabled).toBe(true);
      });

      test('Quando o Email é Valido', async () => {
        axiosPostMockResolved({ data: { id: 'idMock' } });
        const emailRadio = screen.getByLabelText(EMAIL_RADIO);
        userEvent.click(emailRadio);

        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        let button = screen.getByRole('button', { name: REGISTER_BUTTON });

        expect(button.disabled).toBe(true);
        userEvent.type(textInput, EMAIL_EXAMPLE);

        let responseMessage = screen.queryByTestId(RESPONSE_MESSAGE);
        expect(responseMessage).toBe(null);

        button = screen.getByRole('button', { name: REGISTER_BUTTON });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        responseMessage = screen.getByTestId(RESPONSE_MESSAGE);
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('Email registrado com sucesso');
        setTimeout(() => {
          expect(responseMessage).not.toBeInTheDocument();
        }, 5000);
      });

      test('Quando o Email é valido mas já está registrado', async () => {
        axiosPostMockRejected({ response: { data: { message: 'Email Já registrado' } } });
        const emailRadio = screen.getByLabelText(EMAIL_RADIO);
        userEvent.click(emailRadio);

        const textInput = screen.getByPlaceholderText(TEXT_INPUT);
        userEvent.type(textInput, EMAIL_EXAMPLE);

        const button = screen.getByRole('button', { name: REGISTER_BUTTON });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        const responseMessage = screen.getByTestId(RESPONSE_MESSAGE);
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('Email Já registrado');
      });
    });

    describe('Teste do link de Lista de Usuários:', () => {
      test('Deve redirecionar para página de lista de usuários.', () => {
        const { history } = renderWithRouter(<App />, { route: '/register-user' });

        const link = screen.getByText('Lista de Usuários');
        expect(link).toBeInTheDocument();

        userEvent.click(link);
        expect(history.location.pathname).toBe('/');
      });
    });
  });
});
