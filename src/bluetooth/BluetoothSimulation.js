const generateBluetoothData = () => {
    return {
      deviceName: 'Simulated Device',
      data: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    };
  };
  
  export default generateBluetoothData;
  