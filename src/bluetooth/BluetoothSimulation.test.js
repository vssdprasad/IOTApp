import generateBluetoothData from "./BluetoothSimulation";

describe('Bluetooth Simulation Script', () => {
  test('should generate valid Bluetooth data', () => {
    const data = generateBluetoothData();
    expect(data).toHaveProperty('deviceName', 'Simulated Device');
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('timestamp');
  });

  test('should generate unique data each time', () => {
    const data1 = generateBluetoothData();
    const data2 = generateBluetoothData();
    expect(data1.data).not.toBe(data2.data);
  });
});
