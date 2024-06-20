import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddAdvertisement from '../src/pages/AddAdvertisement/AddAdvertisement';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../src/hooks/AuthContext';
import axiosInstance from '../src/pages/Interceptors/axiosInstance';
import sinon from 'sinon';

describe('AddAdvertisement', () => {
    let sandbox;
    beforeAll(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(axiosInstance, 'get').resolves({ data: [] });
    });
    afterAll(() => {
        sandbox.restore();
    });

    it('renders the add advertisement form correctly', async () => {
        const { getByLabelText, getByRole } = render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <AddAdvertisement />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        await waitFor(() => {
            const nameInput = getByLabelText(/Nazwa/i);
            expect(nameInput).toBeInTheDocument();
            const descriptionInput = getByLabelText(/Opis/i);
            expect(descriptionInput).toBeInTheDocument();
            const priceInput = getByLabelText(/Cena/i);
            expect(priceInput).toBeInTheDocument();
            const categoryDropdown = getByRole('button', { name: /Select a category/i });
            expect(categoryDropdown).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        const { getByLabelText, getByRole } = render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <AddAdvertisement />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        await waitFor(() => {
            const nameInput = getByLabelText(/Nazwa/i);
            fireEvent.change(nameInput, { target: { value: 'Test Advertisement' } });
            const descriptionInput = getByLabelText(/Opis/i);
            fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
            const priceInput = getByLabelText(/Cena/i);
            fireEvent.change(priceInput, { target: { value: '100' } });
            const categoryDropdown = getByRole('button', { name: /Select a category/i });
            fireEvent.click(categoryDropdown);
            const submitButton = getByRole('button', { name: /Dodaj ogłoszenie/i });
            fireEvent.click(submitButton);
        });
    });

    it('disallows submission with negative or zero price', async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <AddAdvertisement />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const nameInput = screen.getByLabelText(/Nazwa/i);
            fireEvent.change(nameInput, { target: { value: 'Test Advertisement' } });

            const descriptionInput = screen.getByLabelText(/Opis/i);
            fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

            const priceInput = screen.getByLabelText(/Cena/i);
            fireEvent.change(priceInput, { target: { value: '-50' } }); // Attempting to set a negative price

            const categoryDropdown = screen.getByRole('button', { name: /Select a category/i });
            fireEvent.click(categoryDropdown);

            const submitButton = screen.getByRole('button', { name: /Dodaj ogłoszenie/i });
            fireEvent.click(submitButton);
        });

        // Assert that the form does not submit and displays an error message
        await waitFor(() => {
            expect(screen.getByText(/Price must be a non-negative number/i)).toBeInTheDocument();
        });
    });
}); 

 