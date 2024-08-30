import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';
import generateBluetoothData from './src/bluetooth/BluetoothSimulation';

jest.mock('./src/bluetooth/BluetoothSimulation');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the Scan for Devices button', () => {
    const { getByText } = render(<App />);
    expect(getByText('Scan for Devices')).toBeTruthy();
  });

  test('should display Bluetooth data after scanning', async () => {
    generateBluetoothData.mockReturnValue({
      deviceName: 'Simulated Device',
      data: 'test_data',
      timestamp: '2024-01-01T00:00:00Z',
    });

    const { getByText } = render(<App />);
    const button = getByText('Scan for Devices');
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Device: Simulated Device')).toBeTruthy();
      expect(getByText('Data: test_data')).toBeTruthy();
      expect(getByText('Timestamp: 2024-01-01T00:00:00Z')).toBeTruthy();
    });
  });
});
