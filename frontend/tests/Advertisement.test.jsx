import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Advertisement from '../src/pages/Advertisement/Advertisement.jsx';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axiosInstance from '../src/pages/Interceptors/axiosInstance.js';
import sinon from 'sinon';
import { AuthContext } from "../src/hooks/AuthContext.jsx";

describe('Advertisement Component', () => {
    const mockAdvertisementData = {
        id: '1',
        name: 'Example Advertisement',
        price: 100,
        description: 'This is an example advertisement.',
        images: [{ imageUrl: 'example.com/image1.jpg' }, { imageUrl: 'example.com/image2.jpg' }],
        date: '2024-06-20',
        location: 'Example Location'
    };

    let axiosGetStub;

    beforeEach(() => {
        axiosGetStub = sinon.stub(axiosInstance, 'get');
    });

    afterEach(() => {
        axiosGetStub.restore();
    });

    const setup = () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <Advertisement />
                </AuthContext.Provider>
            </MemoryRouter>
        );
    };
    it('displays advertisement details after data is loaded', async () => {
        axiosGetStub.resolves({ data: mockAdvertisementData });
        setup();

        await screen.findByText(mockAdvertisementData.name);
        expect(screen.getByText(`${mockAdvertisementData.price} USD`)).toBeInTheDocument();
        expect(screen.getByText(mockAdvertisementData.description)).toBeInTheDocument();
    });
});