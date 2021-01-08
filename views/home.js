import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Button } from 'react-native';
import axios from 'axios';
import { getData } from '../utils/global-storage';

export default function HomeScreen({ navigation }) {
    useEffect(() => {
        getData().then((v) => {
            if (v === undefined) {
                navigation.navigate('Login');
            } else {
                axios.defaults.headers.common['Authorization'] = v;
                navigation.navigate('PhotoWall');
            }
        });
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <Button
                onPress={() => { navigation.navigate('PhotoWall') }}
                title="相册"
                color="#841584"
                style={styles.button}
            />
            <Button
                onPress={() => { navigation.navigate('Login') }}
                title="设置"
                style={styles.button}
            />
            <Image
                style={styles.tinyLogo}
                width={'100%'}
                source={require('../imgs/558.jpg')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: '20',
    },
    tinyLogo: {
        width: '100%',
    }
});