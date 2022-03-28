import React from 'react';
import axios from 'axios';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRouter from './renderWithRouter';
import App from '../App';

jest.mock('axios');

const CPF_EXAMPLE = '19011164091';
const CNPJ_EXAMPLE = '97384662000144';

const axiosPostMock = (returnValue) => {
  axios.post.mockResolvedValue(returnValue);
};

afterAll(() => {
  axios.mockRestore();
});

describe('Testes da página de registro de CPF/CNPJ:', () => {
  describe('Testa se os elementos estão presentes na tela:', () => {
    beforeAll(() => {
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
        const button =  screen.getByRole('button', { name: /registrar/i });
        userEvent.type(textInput, '67357');

        const erroMessage = screen.getByTestId('response-message');
        expect(erroMessage).toBeInTheDocument();
        expect(erroMessage.innerText).toBe('CPF inválido');
        expect(button.disabled).toBe(true);
      });

      test('Quando o CPF é Valido', () => {
        axiosPostMock({ status: 201, data: { id: 'abc' } });
        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        let button =  screen.getByRole('button', { name: /registrar/i });

        expect(button.disabled).toBe(true);
        userEvent.type(textInput, CPF_EXAMPLE);

        let responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).not.toBeInTheDocument();

        button = screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        userEvent.click(button);

        responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage).toBe('CPF registrado com sucesso');
        setTimeout(() => {
          expect(responseMessage).not.toBeInTheDocument();
        }, 6000);
      });

      test('Quando o CPF é valido mas já está registrado', () => {
        axiosPostMock({ status: 409, data: { message: 'CPF Já registrado' } });
        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        userEvent.type(textInput, CPF_EXAMPLE);

        const button =  screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        userEvent.click(button);

        const responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage).toBe('CPF Já registrado');
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
        const button =  screen.getByRole('button', { name: /registrar/i });
        userEvent.type(textInput, '67357');

        const erroMessage = screen.getByTestId('response-message');
        expect(erroMessage).toBeInTheDocument();
        expect(erroMessage.innerText).toBe('CNPJ inválido');
        expect(button.disabled).toBe(true);
      });

      test('Quando o CNPJ é Valido', () => {
        axiosPostMock({ status: 201, data: { id: 'abc' } });
        const cnpjRadio = screen.getByLabelText('CNPJ');
        userEvent.click(cnpjRadio);

        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        let button =  screen.getByRole('button', { name: /registrar/i });

        expect(button.disabled).toBe(true);
        userEvent.type(textInput, CNPJ_EXAMPLE);

        let responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).not.toBeInTheDocument();

        button = screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        userEvent.click(button);

        responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage).toBe('CNPJ registrado com sucesso');
        setTimeout(() => {
          expect(responseMessage).not.toBeInTheDocument();
        }, 6000);
      });

      test('Quando o CNPJ é valido mas já está registrado', () => {
        axiosPostMock({ status: 409, data: { message: 'CNPJ Já registrado' } });
        const cnpjRadio = screen.getByLabelText('CNPJ');
        userEvent.click(cnpjRadio);

        const textInput = screen.getByPlaceholderText('CPF/CNPJ');
        userEvent.type(textInput, CNPJ_EXAMPLE);

        const button =  screen.getByRole('button', { name: /registrar/i });
        expect(button.disabled).toBe(false);
        userEvent.click(button);

        const responseMessage = screen.getByTestId('response-message');
        expect(responseMessage).toBeInTheDocument();
        expect(responseMessage).toBe('CNPJ Já registrado');
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
