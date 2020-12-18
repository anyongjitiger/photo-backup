import React, {useState} from 'react';
import {StyleSheet, Button, TextInput, View} from 'react-native';
import axios from 'axios';
const common_url = global.common_url;
export default function Login() {
  const [pin, setPin] = useState('');
  const onPress = () => {
    axios
      .post(common_url + 'login', {
        pin: pin,
      })
      .then((res) => {
        console.log(res.token);
        global.storage.save({
          key: 'token',
          data: res.token,
          expires: null,
        });
        setPin('');
      });
  };
  return (
    <View style={styles.view}>
      <TextInput style={{height: 40}} value={pin} placeholder="PIN CODE" />
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
