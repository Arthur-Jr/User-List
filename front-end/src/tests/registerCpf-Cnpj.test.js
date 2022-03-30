import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRouter from './renderWithRouter';
import App from '../App';

jest.mock('axios');

const CPF_EXAMPLE = '19011164091';
const CNPJ_EXAMPLE = '97384662000144';

const axiosPostMockResolved = (returnValue) => {
  axios.post.mockResolvedValue(returnValue);
};

const axiosPostMockRejected = (returnValue) => {
  axios.post.mockRejectedValue(returnValue);
};

afterAll(() => {
  axios.mockRestore();
});

describe('Testes da página de registro de CPF/CNPJ:', () => {
  describe('Testa se os elementos estão presentes na tela:', () => {
    beforeEach(() => {
      renderWithRouter(<App />, { route: '/register-cpf-cnpj' });
    });

    test('Deve conter o título "Registrar CPF/CNPJ"', () => {
      const title = screen.getByRole('heading', { level: 1, name: 'Registrar CPF/CNPJ' });
      expect(title).toBeInTheDocument();
    });

    test('Deve conter 2 botões radio.', () => {
      const cpfRadio = screen.getByLabelText('CPF');
      const cnpjRadio = screen.getByLabelText('CNPJ');
      expect(cpfRadio).toBeInTheDocument();
      expect(cpfRadio.checked).toBe(true);
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

    test('Deve conter um botão.', () => {
      const button = screen.getByRole('button', { name: /registrar/i });
      expect(button).toBeInTheDocument();
      expect(button.disabled).toBe(true);
    });

    test('Deve conter um link para a consulta de CPF/CNPJ', () => {
      const link = screen.getByText('Consultar CPF/CNPJ');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Teste das funcionalidades da página de registro de CPF/CNPJ.', () => {
    describe('Testes relacionado ao CPF:', () => {
      beforeEach(() => {
        renderWithRouter(<App />, { route: '/register-cpf-cnpj' });
      });

      test('Quando o CPF é Inválido', () => {
        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        userEvent.type(textInput, '67357');
        const button = screen.getByRole('button', { name: /registrar/i });

        const erroMessage = screen.getByTestId('response-message');
        expect(erroMessage).toBeInTheDocument();
        expect(erroMessage.innerHTML).toBe('CPF inválido');
        expect(button.disabled).toBe(true);
      });

      test('Quando o CPF é Valido', async () => {
        axiosPostMockResolved({ data: { id: 'abc' } });
        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        let button = screen.getByRole('button', { name: /registrar/i });

        expect(button.disabled).toBe(true);
        userEvent.type(textInput, CPF_EXAMPLE);

        let responseMessage = screen.queryByTestId('response-message');
        expect(responseMessage).toBe(null);

        button = screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('CPF registrado com sucesso');
        setTimeout(() => {
          expect(responseMessage).not.toBeInTheDocument();
        }, 6000);
      });

      test('Quando o CPF é valido mas já está registrado', async () => {
        axiosPostMockRejected({ response: { data: { message: 'CPF Já registrado' } } });
        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        userEvent.type(textInput, CPF_EXAMPLE);

        const button = screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        const responseMessage = screen.getByTestId('response-message');

        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('CPF Já registrado');
      });
    });

    describe('Testes relacionado ao CNPJ:', () => {
      beforeEach(() => {
        renderWithRouter(<App />, { route: '/register-cpf-cnpj' });
      });

      test('Quando o CNPJ é Inválido', () => {
        const cnpjRadio = screen.getByLabelText('CNPJ');
        userEvent.click(cnpjRadio);

        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        const button = screen.getByRole('button', { name: /registrar/i });
        userEvent.type(textInput, '67357');

        const erroMessage = screen.getByTestId('response-message');
        expect(erroMessage).toBeInTheDocument();
        expect(erroMessage.innerHTML).toBe('CNPJ inválido');
        expect(button.disabled).toBe(true);
      });

      test('Quando o CNPJ é Valido', async () => {
        axiosPostMockResolved({ data: { id: 'abc' } });
        const cnpjRadio = screen.getByLabelText('CNPJ');
        userEvent.click(cnpjRadio);

        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        let button = screen.getByRole('button', { name: /registrar/i });

        expect(button.disabled).toBe(true);
        userEvent.type(textInput, CNPJ_EXAMPLE);

        let responseMessage = screen.queryByTestId('response-message');
        expect(responseMessage).toBe(null);

        button = screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('CNPJ registrado com sucesso');
        setTimeout(() => {
          expect(responseMessage).not.toBeInTheDocument();
        }, 6000);
      });

      test('Quando o CNPJ é valido mas já está registrado', async () => {
        axiosPostMockRejected({ response: { data: { message: 'CNPJ Já registrado' } } });
        const cnpjRadio = screen.getByLabelText('CNPJ');
        userEvent.click(cnpjRadio);

        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        userEvent.type(textInput, CNPJ_EXAMPLE);

        const button = screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        await act(async () => {
          userEvent.click(button);
        });

        const responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage.innerHTML).toBe('CNPJ Já registrado');
      });
    });

    describe('Teste do link de consulta CPF/CNPJ:', () => {
      test('Deve redirecionar para página de consulta.', () => {
        const { history } = renderWithRouter(<App />, { route: '/register-cpf-cnpj' });

        const link = screen.getByText('Consultar CPF/CNPJ');
        expect(link).toBeInTheDocument();

        userEvent.click(link);
        expect(history.location.pathname).toBe('/');
      });
    });
  });
});
