import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('renders the main heading', () => {
        render(<App />);
        expect(screen.getByText('Order Controller')).toBeInTheDocument();
    });

    it('adds a normal order to the pending list', () => {
        render(<App />);
        const normalOrderButton = screen.getByText('🧍 Normal Order');
        fireEvent.click(normalOrderButton);

        const pendingOrders = screen.getByText('Order-1 (🧍 Normal) - PENDING');
        expect(pendingOrders).toBeInTheDocument();
    });

    it('adds a VIP order to the pending list', () => {
        render(<App />);
        const vipOrderButton = screen.getByText('👑 VIP Order');
        fireEvent.click(vipOrderButton);

        const vipOrder = screen.getByText('Order-1 (👑 VIP) - PENDING');
        expect(vipOrder).toBeInTheDocument();
    });

    it('adds a bot and assigns it to an order', () => {
        render(<App />);
        const normalOrderButton = screen.getByText('🧍 Normal Order');
        const addBotButton = screen.getByText('➕ Add Bot');

        fireEvent.click(normalOrderButton);
        fireEvent.click(addBotButton);

        const botProcessingOrder = screen.getByText('Order-1 (🧍 Normal) - IN_PROGRESS');
        expect(botProcessingOrder).toBeInTheDocument();
    });

    it('processes an order to IN_PROGRESS and then resets it to PENDING when the bot is removed', () => {
        render(<App />);
        const normalOrderButton = screen.getByText('🧍 Normal Order');
        const addBotButton = screen.getByText('➕ Add Bot');
        const removeBotButton = screen.getByText('➖ Remove Bot');

        fireEvent.click(normalOrderButton);
        fireEvent.click(addBotButton);

        const inProgressOrder = screen.getByText('Order-1 (🧍 Normal) - IN_PROGRESS');
        expect(inProgressOrder).toBeInTheDocument();

        fireEvent.click(removeBotButton);

        const pendingOrder = screen.getByText('Order-1 (🧍 Normal) - PENDING');
        expect(pendingOrder).toBeInTheDocument();
    });

    it('prioritizes VIP orders over normal orders', () => {
        render(<App />);
        const normalOrderButton = screen.getByText('🧍 Normal Order');
        const vipOrderButton = screen.getByText('👑 VIP Order');
        const addBotButton = screen.getByText('➕ Add Bot');

        fireEvent.click(normalOrderButton);
        fireEvent.click(vipOrderButton);
        fireEvent.click(addBotButton);

        const vipOrder = screen.getByText('Order-2 (👑 VIP) - IN_PROGRESS');
        expect(vipOrder).toBeInTheDocument();
    });

    it('does not allow removing a bot when no bots exist', () => {
        render(<App />);
        const removeBotButton = screen.getByText('➖ Remove Bot');
        expect(removeBotButton).toBeDisabled();
    });

    it('processes orders in the correct sequence', () => {
        render(<App />);
        const normalOrderButton = screen.getByText('🧍 Normal Order');
        const addBotButton = screen.getByText('➕ Add Bot');

        fireEvent.click(normalOrderButton);
        fireEvent.click(normalOrderButton);
        fireEvent.click(addBotButton);

        const firstOrder = screen.getByText('Order-1 (🧍 Normal) - IN_PROGRESS');
        expect(firstOrder).toBeInTheDocument();
    });
});