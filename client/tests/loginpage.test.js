import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Needed for any component using Link or useNavigate
import LoginPage from '../src/components/LoginPage';

describe('LoginPage', () => {
    it('renders a login page', () => {
        const div = document.createElement('div');
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const loginForm = screen.getByTestId('login-form');
        expect(loginForm).toBeInTheDocument();
    }
    );

  it('updates email and password in state on change', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('username / email');
    const passwordInput = screen.getByPlaceholderText('password');

    fireEvent.change(emailInput, { target: { value: 'dillongo@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput.value).toBe('dillongo@gmail.com');
    expect(passwordInput.value).toBe('password');
  });
});
