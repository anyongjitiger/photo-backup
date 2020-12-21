import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PhotoWall from './views/photo-wall';
import Login from './views/login';
import {NavigationContainer} from '@react-navigation/native';
import { Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PhotoWall"
          component={PhotoWall}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
