// AddAdvertisement.test.jsx lub AddAdvertisement.test.tsx

import { expect, test, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddAdvertisement from '../src/pages/AddAdvertisement/AddAdvertisement.jsx'; // Ścieżka do komponentu AddAdvertisement
import { MemoryRouter } from 'react-router-dom';

// Przykładowy test sprawdzający renderowanie formularza
test('renders Add Advertisement form', async () => {
    render(
        <MemoryRouter>
            <AddAdvertisement />
        </MemoryRouter>
    );

    // Sprawdź, czy formularz się renderuje poprawnie
    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toBeInTheDocument();

    const descriptionInput = screen.getByLabelText(/Description/i);
    expect(descriptionInput).toBeInTheDocument();

    const priceInput = screen.getByLabelText(/Price/i);
    expect(priceInput).toBeInTheDocument();

    const categoryDropdown = screen.getByRole('button', { name: /Category/i });
    expect(categoryDropdown).toBeInTheDocument();
});

// Przykładowy test sprawdzający dodanie reklamy
test('adds an advertisement successfully', async () => {    render(
    <MemoryRouter>
        <AddAdvertisement />
    </MemoryRouter>
);

    // Symulacja wybrania danych w formularzu
    const nameInput = screen.getByLabelText(/Name/i);
    userEvent.type(nameInput, 'Example Advertisement');

    const descriptionInput = screen.getByLabelText(/Description/i);
    userEvent.type(descriptionInput, 'This is a test advertisement.');

    const priceInput = screen.getByLabelText(/Price/i);
    userEvent.type(priceInput, '100');

    const categoryDropdown = screen.getByRole('button', { name: /Category/i });
    userEvent.click(categoryDropdown);

    const categoryOption = await screen.findByText('Example Category'); // Zmodyfikuj, aby pasowało do rzeczywistej opcji
    userEvent.click(categoryOption);

    // Symulacja kliknięcia przycisku dodania reklamy
    const addButton = screen.getByRole('button', { name: /Add Advertisement/i });
    userEvent.click(addButton);

    // Oczekiwanie na sukces
    await waitFor(() => {
        const successMessage = screen.getByText(/Advertisement added successfully/i);
        expect(successMessage).toBeInTheDocument();
    });
});