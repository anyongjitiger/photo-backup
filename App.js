/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ToastExample from './ToastExample';
import MyStack from './stack-nav';

global.common_url = 'http://172.29.176.1:8000/';
const App: () => React$Node = () => {
  // ToastExample.show('Awesome', ToastExample.SHORT);
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <MyStack />
      {/* <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <MyStack />
      </NavigationContainer> */}
    </>
  );

  /* <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <MyStack />
    </NavigationContainer> */
};

/* const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
}); */

export default App;
