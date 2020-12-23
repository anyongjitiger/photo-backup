import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { getData } from '../utils/global-storage';
export default function HomeScreen({ navigation }) {
    useEffect(() => {
        getData().then((v) => {
            console.log('token:', v);
            if (v === undefined) {
                navigation.navigate('Login');
            } else {
                axios.defaults.headers.common['Authorization'] = v;
                navigation.navigate('PhotoWall');
            }
        });
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}