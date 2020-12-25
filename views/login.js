import React, { useState } from 'react';
import {StyleSheet, Button, TextInput, View} from 'react-native';
import axios from 'axios';
import ToastExample from '../ToastExample';
import GlobalVar, { setCommonUrl } from '../utils/global-var.js';
import { storeData } from '../utils/global-storage';
let common_url = GlobalVar.common_url;
export default function Login({ navigation }) {
  const [pin, setPin] = useState('');
  const [url, setUrl] = useState(common_url);
  const [urlChanged, setUrlChanged] = useState(false);
  const changePin = (event) => {
    setPin(event.nativeEvent.text);
  };
  const changeUrl = (event) => {
    setUrlChanged(true);
    setUrl(event.nativeEvent.text);
  };
  const login = () => {
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
      ToastExample.show('该号码已过期！', ToastExample.LONG);
    });
  };
  const onPress = () => {
    if (urlChanged) {
      setCommonUrl(url).then((r) => {
        common_url = r;
        login();
      });
    } else {
      login();
    }

  };
  return (
    <View style={styles.view}>
      <TextInput
        style={{ height: 40 }}
        value={pin}
        onChange={changePin}
        placeholder="PIN CODE"
      />
      <TextInput
        style={{ height: 40 }}
        value={url}
        onChange={changeUrl}
        placeholder="URL"
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
