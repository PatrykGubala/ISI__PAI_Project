import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axiosMock from 'axios-mock-adapter';
import axiosInstance from '../src/pages/Interceptors/axiosInstance';
import RoleManage from '../src/pages/RoleManager/RoleManage';
import {MemoryRouter} from "react-router-dom";
import {AuthContext} from "../src/hooks/AuthContext.jsx";
import Advertisement from "../src/pages/Advertisement/Advertisement.jsx";

const mock = new axiosMock(axiosInstance);

describe('RoleManage', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('should update user role when changed and button is clicked', async () => {
        const users = [
            { id: 1, userId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'USER' },
        ];

        mock.onGet('/admin/users').reply(200, users);
        mock.onPut('/admin/users/1/role').reply(200);

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <RoleManage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
        });

        // Find the select element for changing role and open the dropdown
        const roleSelects = screen.getAllByRole('combobox');
        fireEvent.mouseDown(roleSelects[0]);

        // Find the option "ADMIN" and click it
        const newRoleOptions = screen.getAllByText('ADMIN');
        fireEvent.click(newRoleOptions[0]);

        const updateButton = screen.getByRole('button', { name: /zmień uprawnienia/i });
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mock.history.put.length).toBe(1);
            expect(mock.history.put[0].data).toEqual(JSON.stringify({ role: 'ADMIN' }));
        });

        expect(screen.getByText('Rola użytkownika została zaktualizowana.')).toBeInTheDocument();
    });
});