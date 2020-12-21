import React, { useState } from 'react';
import {StyleSheet, Button, TextInput, View} from 'react-native';
import axios from 'axios';
import GlobalVar from '../utils/global-var.js';
import { storeData } from '../utils/global-storage';
const common_url = GlobalVar.common_url;
export default function Login({ navigation }) {
  const [pin, setPin] = useState('');
  const login = (event) => {
    setPin(event.nativeEvent.text);
  };
  const onPress = () => {
    axios
      .post(common_url + 'login', {
        pin: pin,
      })
      .then((res) => {
        if (res.status === 200) {
          const _token = res.data.token;
          storeData(_token);
          axios.defaults.headers.common['Authorization'] = _token;
          setPin('');
          navigation.navigate('PhotoWall');
        }
      })
      .catch(function (error) {
        // error
        console.log('login error: ', error);
      });
  };
  return (
    <View style={styles.view}>
      <TextInput
        style={{ height: 40 }}
        value={pin}
        onChange={login}
        placeholder="PIN CODE"
      />
      <Button onPress={onPress} title="Login" color="#841584" />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
  },
});
