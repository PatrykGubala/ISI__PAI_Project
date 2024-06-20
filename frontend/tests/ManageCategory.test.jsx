import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageCategory from '../src/pages/ManageCategory/ManageCategory';
import { AuthContext } from '../src/hooks/AuthContext';
import axiosInstance from '../src/pages/Interceptors/axiosInstance';
import sinon from 'sinon';
import { vi, describe, beforeAll, afterAll, it, expect } from 'vitest';

// Mock axiosInstance
vi.mock('../src/pages/Interceptors/axiosInstance', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('ManageCategory', () => {
    let sandbox;

    beforeAll(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(axiosInstance, 'get').resolves({ data: [] });
        sandbox.stub(axiosInstance, 'post').resolves({ data: {} });
    });

    afterAll(() => {
        sandbox.restore();
    });

    it('renders the manage category form correctly', async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <ManageCategory />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Nazwa/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Opis/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /None/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Dodaj pole/i })).toBeInTheDocument();
        });
    });

});
