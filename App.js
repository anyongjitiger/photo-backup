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
import { removeData, clearStorage } from './utils/global-storage';
import FlashMessage from "react-native-flash-message";
import './utils/request';
import MyStack from './stack-nav';
const App: () => React$Node = () => {
  // ToastExample.show('Awesome', ToastExample.SHORT);
  useEffect(() => {
    SplashScreen.hide();
    // clearStorage();
  /* removeData('auth_token').then(() => {
    console.log("clear token");
  }); */
  });
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <MyStack />
      <FlashMessage position="top" />
    </>
  );
};

export default App;
