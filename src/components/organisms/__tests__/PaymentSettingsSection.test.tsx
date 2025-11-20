import React from 'react';
import { render, screen } from '@/test-utils';
import { PaymentSettingsSection } from '../PaymentSettingsSection';

// Mock the child components
jest.mock('../../molecules/SectionCard', () => ({
  SectionCard: ({ title, icon, children }: any) => (
    <div data-testid="section-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

jest.mock('../../molecules/PaymentMethodCard', () => ({
  PaymentMethodCard: ({ name, phoneNumber, status }: any) => (
    <div data-testid="payment-method-card">
      <span>{name}</span>
      <span>{phoneNumber}</span>
      <span>{status}</span>
    </div>
  ),
}));

jest.mock('../../atoms/SettingItem', () => ({
  SettingItem: ({ icon, label }: any) => (
    <div data-testid="setting-item">
      <span>{label}</span>
    </div>
  ),
}));

describe('PaymentSettingsSection', () => {
  const mockPhoneNumber = '+254712345678';

  describe('Rendering', () => {
    it('renders the section with correct title', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByText('Payment Settings')).toBeInTheDocument();
    });

    it('renders the payment method card', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByTestId('payment-method-card')).toBeInTheDocument();
    });

    it('renders M-PESA Account name', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByText('M-PESA Account')).toBeInTheDocument();
    });

    it('renders the phone number', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByText(mockPhoneNumber)).toBeInTheDocument();
    });

    it('renders Active status', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders Transaction Limits setting item', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByText('Transaction Limits')).toBeInTheDocument();
    });

    it('renders setting item component', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByTestId('setting-item')).toBeInTheDocument();
    });

    it('renders section card component', () => {
      render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      expect(screen.getByTestId('section-card')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes phoneNumber prop to PaymentMethodCard', () => {
      const customPhone = '+254700000000';
      render(<PaymentSettingsSection phoneNumber={customPhone} />);
      expect(screen.getByText(customPhone)).toBeInTheDocument();
    });

    it('handles different phone number formats', () => {
      const phoneNumbers = ['+254712345678', '0712345678', '+254700000000'];

      phoneNumbers.forEach((phone) => {
        const { unmount } = render(<PaymentSettingsSection phoneNumber={phone} />);
        expect(screen.getByText(phone)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Component Structure', () => {
    it('renders payment method card before setting item', () => {
      const { container } = render(<PaymentSettingsSection phoneNumber={mockPhoneNumber} />);
      const paymentCard = screen.getByTestId('payment-method-card');
      const settingItem = screen.getByTestId('setting-item');

      expect(paymentCard.compareDocumentPosition(settingItem)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });
});
