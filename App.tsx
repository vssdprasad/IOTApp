/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {BleErrorCode, BleManager} from 'react-native-ble-plx';
import generateBluetoothData from './src/bluetooth/BluetoothSimulation';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  //State for device data
  const [deviceData, setDeviceData] = useState(null);

  //Creating object for manager
  const manager = new BleManager();

  //State for bluetooth enabled or disbaled
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  //Request permission when ever scanning for devices

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
  
      if (
        granted['android.permission.BLUETOOTH_SCAN'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.BLUETOOTH_CONNECT'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.warn('Bluetooth permissions not granted');
        return false;
      }
    }
  
    return true;
  };


  //Start bluetooth permissions
  const startBluetoothOperations = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
  };



  //Scan the deivces
  const scanDevices = () => {
    // console.log("Bluetooth scanning started");
    
    startBluetoothOperations();
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
          console.error('Bluetooth not authorized');
        } else if (error.errorCode === BleErrorCode.BluetoothPoweredOff) {
          console.error('Bluetooth is off');
        } else if (error.errorCode === BleErrorCode.LocationServicesDisabled) {
          console.error('Location services are disabled');
        } else {
          console.error('Unknown error:', error);
        }
        return;
      }
      // console.log("Device detials", device);
      
      if (device.id) {
        manager.stopDeviceScan();

        //Get the random data from the simulation and set it in state
        const randomData = generateBluetoothData();
        setDeviceData(randomData);
        storeData(randomData);
      }
    });
  };


  //Store the data in local storage

  const storeData = async data => {
    try {
      await AsyncStorage.setItem('@bluetooth_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data.', e);
    }
  };

  //Get the data from the local store

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@bluetooth_data');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch data.', e);
    }
  };


  //When initial render occures get the data from local store and set it in state
  useEffect(() => {async() =>{
    const deviceData = await getData();
    if (deviceData) {
      setDeviceData(deviceData);
    }
  }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'#000'}
      />
      <View style={{}}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 32, color: '#fff'}}>
            React Native Bluetooth Simulation
          </Text>
        </View>

        <View style={{marginTop: '5%', alignItems: 'center'}}>
          <Button title="Scan for Devices" onPress={scanDevices} />
          {deviceData && (
            <View style={{marginTop:'5%',marginHorizontal:'2%',alignItems:'center',justifyContent:'space-between'}}>
              <Text style={styles.textStyles}>Device: {deviceData?.deviceName}</Text>
              <Text style={styles.textStyles}>Data: {deviceData?.data}</Text>
              <Text style={styles.textStyles}>Timestamp: {deviceData?.timestamp}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textStyles: {
    color: '#fff',
    fontSize: 20,
  }
});

export default App;
