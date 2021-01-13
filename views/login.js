import React, { useState, useEffect } from 'react';
import {StyleSheet, Button, TextInput, View} from 'react-native';
import axios from 'axios';
import { setCommonUrl } from '../utils/global-var.js';
import { setData, getData } from '../utils/global-storage';
import { showMessage } from "react-native-flash-message";
export default function Login({ navigation }) {
  const [pin, setPin] = useState('');
  const [url, setUrl] = useState('');
  const [urlChanged, setUrlChanged] = useState(false);
  useEffect(() => {
    getData('common_url').then((_url) => {
      setUrl(_url);
    });
  }, []);
  const changePin = (event) => {
    setPin(event.nativeEvent.text);
  };
  const changeUrl = (event) => {
    setUrlChanged(true);
    setUrl(event.nativeEvent.text);
  };
  const login = () => {
    axios
      .post(url + 'login', {
      pin: pin,
    })
    .then((res) => {
      if (res.status === 200) {
        const _token = res.data.token;
        setData('auth_token', _token).then(v => {
          axios.defaults.headers.common['Authorization'] = _token;
          setPin('');
          navigation.navigate('PhotoWall');
        });
        if (urlChanged) {
          setData('common_url', url).then((r) => {
            console.log("保存地址：", url);
          });
        }
      }
    })
    .catch(function (error) {
      console.log("login error:", error);
      showMessage({
        message: "登录失败！",
        type: "warning",
      });
    });
  };
  const onPress = () => {
    if (urlChanged) {
      setCommonUrl(url).then((r) => {
        setUrl(r);
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
        placeholder="服务器地址"
      />
      <Button onPress={onPress} title="登录" color="#841584" />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
  },
});
