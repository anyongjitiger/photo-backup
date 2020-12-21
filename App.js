/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  StatusBar,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import ToastExample from './ToastExample';
import { clearStorage } from './utils/global-storage';
import MyStack from './stack-nav';
const App: () => React$Node = () => {
  // ToastExample.show('Awesome', ToastExample.SHORT);
  useEffect(() => {
    SplashScreen.hide();
    clearStorage();
  });
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <MyStack />
    </>
  );
};

export default App;
