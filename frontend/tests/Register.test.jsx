// tests/Register.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../src/pages/Register/Register'; // Ensure the path is correct
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('Register Component', () => {
    const setup = () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    };
//Test sprawdza, czy formularz rejestracji jest w stanie zostać wysłany poprawnie po wprowadzeniu prawidłowych danych.
    it('submits the form successfully with valid data', async () => {
        setup();
        fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
        fireEvent.change(screen.getByLabelText(/Numer telefonu/i), { target: { value: '123456789' } });
        fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jkowalski' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jan@example.com' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i, { selector: '#password' }), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/Potwierdź hasło/i), { target: { value: 'Password123!' } });

        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
        });
    });

    //Test sprawdza, czy formularz rejestracji wyświetla komunikaty błędów, gdy wszystkie wymagane pola są puste
    it('displays error messages when required fields are empty', async () => {
        setup();
        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Wszystkie pola formularza są wymagane/i)).toBeInTheDocument();
        });
    });
    //Test sprawdza, czy formularz rejestracji wyświetla komunikat błędu, gdy format wprowadzonego adresu email jest niepoprawny.
    it('displays an error when the email format is incorrect', async () => {
        setup();
        fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
        fireEvent.change(screen.getByLabelText(/Numer telefonu/i), { target: { value: '123456789' } });
        fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jkowalski' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalidemail' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i, { selector: '#password' }), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/Potwierdź hasło/i), { target: { value: 'Password123!' } });
        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Nieprawidłowy adres email/i)).toBeInTheDocument();
        });
    });
//Test sprawdza, czy formularz rejestracji wyświetla komunikat błędu, gdy wprowadzone hasła nie są identyczne.
    it('displays an error when passwords do not match', async () => {
        setup();
        fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
        fireEvent.change(screen.getByLabelText(/Numer telefonu/i), { target: { value: '123456789' } });
        fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jkowalski' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jan@example.com' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i, { selector: '#password' }), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/Potwierdź hasło/i), { target: { value: 'DifferentPassword123!' } });
        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Hasła nie są identyczne/i)).toBeInTheDocument();
        });
    });
//Test sprawdza, czy formularz rejestracji wyświetla komunikat błędu, gdy wprowadzony numer telefonu nie składa się z dokładnie 9 cyfr.
    it('displays an error when the phone number is not 9 digits', async () => {
        setup();

        // Fill in all other fields with valid data
        fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
        fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jkowalski' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jan@example.com' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i, { selector: '#password' }), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/Potwierdź hasło/i), { target: { value: 'Password123!' } });

        // Test the phone number field specifically
        fireEvent.change(screen.getByLabelText(/Numer telefonu/i), { target: { value: '12345' } });
        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Numer telefonu musi składać się z 9 cyfr/i)).toBeInTheDocument();
        });
    });
//Test sprawdza, czy formularz rejestracji wyświetla komunikat błędu, gdy wprowadzone hasło jest zbyt krótkie (mniej niż 8 znaków).
    it('displays an error when the password is too short', async () => {
        setup();

        // Fill in all other fields with valid data
        fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
        fireEvent.change(screen.getByLabelText(/Numer telefonu/i), { target: { value: '123456789' } });
        fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jkowalski' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jan@example.com' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i, { selector: '#password' }), { target: { value: 'Short1!' } });
        fireEvent.change(screen.getByLabelText(/Potwierdź hasło/i), { target: { value: 'Short1!' } });

        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Hasło musi mieć co najmniej 8 znaków/i)).toBeInTheDocument();
        });
    });
//Test sprawdza, czy formularz rejestracji wyświetla komunikat błędu, gdy wprowadzone hasło nie zawiera żadnego znaku specjalnego.
    it('displays an error when the password does not contain a special character', async () => {
        setup();

        // Fill in all other fields with valid data
        fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
        fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
        fireEvent.change(screen.getByLabelText(/Numer telefonu/i), { target: { value: '123456789' } });
        fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jkowalski' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jan@example.com' } });
        fireEvent.change(screen.getByLabelText(/Hasło/i, { selector: '#password' }), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText(/Potwierdź hasło/i), { target: { value: 'Password123' } });

        const submitButton = screen.getByRole('button', { name: /Zarejestruj/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Hasło musi zawierać przynajmniej jeden znak specjalny/i)).toBeInTheDocument();
        });
    });
});