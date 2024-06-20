import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Main from '../src/pages/Main/Main';
import axiosInstance from '../src/pages/Interceptors/axiosInstance';
import { AuthContext } from '../src/hooks/AuthContext';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock axiosInstance
vi.mock('../src/pages/Interceptors/axiosInstance', () => ({
    default: {
        get: vi.fn(),
    },
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('Main Component', () => {
    beforeEach(() => {
        axiosInstance.get.mockResolvedValue({
            data: {
                content: [
                    { id: 1, name: 'Product 1', category: 'Category 1' },
                    { id: 2, name: 'Product 2', category: 'Category 2' },
                ],
                totalElements: 2,
                categories: ['Category 1', 'Category 2'],
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', async () => {
        renderWithRouter(
            <AuthContext.Provider value={{ login: vi.fn() }}>
                <Main />
            </AuthContext.Provider>
        );
        expect(await screen.findByText('Product 1')).toBeInTheDocument();
        expect(await screen.findByText('Product 2')).toBeInTheDocument();
    });

    it('filters without minimum and maximum price', async () => {
        renderWithRouter(
            <AuthContext.Provider value={{ login: vi.fn() }}>
                <Main />
            </AuthContext.Provider>
        );

        // Simulate filter action without minimum and maximum price
        // Assuming Filter component has category dropdown and apply button
        const categoryDropdown = screen.getByLabelText('Category'); // Adjust label text accordingly
        fireEvent.change(categoryDropdown, { target: { value: 'Category 1' } });

        const applyButton = screen.getByText('Apply Filters'); // Adjust button text accordingly
        fireEvent.click(applyButton);

        // Verify filtered results
        expect(await screen.findByText('Product 1')).toBeInTheDocument();
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
});
