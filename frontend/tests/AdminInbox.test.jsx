import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminInbox from '../src/pages/AdminInbox/AdminInbox';
import axiosInstance from '../src/pages/Interceptors/axiosInstance';
import sinon from 'sinon';
import {MemoryRouter} from "react-router-dom";
import {AuthContext} from "../src/hooks/AuthContext.jsx";
import { describe, it, expect } from 'vitest';
describe('AdminInbox Component', () => {
    const mockMessages = [
        {
            messageId: '1',
            email: 'test@example.com',
            firstname: 'John',
            lastName: 'Doe',
            title: 'Test Message',
            description: 'This is a test message.',
        },
        {
            messageId: '2',
            email: 'another@example.com',
            firstname: 'Jane',
            lastName: 'Smith',
            title: 'Another Message',
            description: 'This is another test message.',
        },
    ];

    let axiosGetStub;
    let axiosDeleteStub;

    beforeEach(() => {
        axiosGetStub = sinon.stub(axiosInstance, 'get');
        axiosDeleteStub = sinon.stub(axiosInstance, 'delete');
    });

    afterEach(() => {
        axiosGetStub.restore();
        axiosDeleteStub.restore();
    });
//sprawdza, czy komponent AdminInbox poprawnie usuwa wiadomość po kliknięciu przycisku "Usuń".
    it('deletes a message when "Usuń" button is clicked', async () => {
        axiosGetStub.resolves({ data: mockMessages });
        axiosDeleteStub.resolves(); // Możemy zwrócić pustą odpowiedź, bo nie zwraca ona żadnych danych

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <AdminInbox />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await screen.findByText('Skrzynka odbiorcza'); // Oczekiwanie na załadowanie komponentu

        const deleteButton = screen.getAllByRole('button', { name: /Usuń/i })[0]; // Wybierz pierwszy przycisk "Usuń"
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
        });
    });

//sprawdza, czy po niepowodzeniu usunięcia wiadomości z komponentu AdminInbox, użytkownikowi wyświetlany jest odpowiedni komunikat błędu.
    it('displays error message when message deletion fails', async () => {
        axiosGetStub.resolves({ data: mockMessages });
        axiosDeleteStub.rejects(new Error('Failed to delete message'));
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <AdminInbox />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        await screen.findByText('Skrzynka odbiorcza'); // Oczekiwanie na załadowanie komponentu

        const deleteButton = screen.getAllByRole('button', { name: /Usuń/i })[0]; // Wybierz pierwszy przycisk "Usuń"
        fireEvent.click(deleteButton);

        await screen.findByText('Nie udało się usunąć wiadomości');
    });

    it('expands message details when expand button is clicked', async () => {
        axiosGetStub.resolves({ data: mockMessages });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <AdminInbox />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await screen.findByText('Skrzynka odbiorcza'); // Oczekiwanie na załadowanie komponentu

        // Znajdź przycisk rozwijający pierwszy wiersz (można użyć role lub tekstu w zależności od implementacji)
        const expandButton = screen.getAllByRole('button', { name: /expand/i })[0];
        fireEvent.click(expandButton);
        // Oczekiwanie na załadowanie i sprawdzenie, czy szczegóły wiadomości zostały rozwinięte
        await waitFor(() => {
            expect(screen.getByText(/Imię:/)).toBeInTheDocument();
            expect(screen.getByText(/John/)).toBeInTheDocument();
            expect(screen.getByText(/Nazwisko:/)).toBeInTheDocument();
            expect(screen.getByText(/Doe/)).toBeInTheDocument();
            expect(screen.getByText(/Temat:/)).toBeInTheDocument();
            expect(screen.getByText(/Test Message/)).toBeInTheDocument();
            expect(screen.getByText(/Wiadomość:/)).toBeInTheDocument();
            expect(screen.getByText(/This is a test message\./)).toBeInTheDocument();
        });

        const closeButton = screen.getAllByRole('button', { name: /collapse/i })[0];
        expect(closeButton).toBeInTheDocument();
    });
});