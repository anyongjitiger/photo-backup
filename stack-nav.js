import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PhotoWall from './views/photo-wall';
import Login from './views/login';
import HomeScreen from './views/home';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '主页' }} />
        <Stack.Screen
          name="PhotoWall"
          component={PhotoWall}
          options={{ title: '相册' }}
        />
        <Stack.Screen name="Login" component={Login} options={{ title: '设置' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
