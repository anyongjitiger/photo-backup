import React, {useState, useEffect} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default function Photos() {
  const [avatarSource, setAvatarSource] = useState({uri: ''});

  /* const options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册',
    mediaType: 'photo',
    allowsEditing: true,
  };
  ImagePicker.launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const source = {uri: response.uri};
      console.log(response.uri);
      setAvatarSource(source);
    }
  }); */

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.photos}>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/3ded9ed1402c0a9e92bf3e99578ea860.jpg')}
          />
        </View>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/3f3a03d1a3ce97e458010e2ff3a68d76026a28a216-ZpDAnr_fw658.jpeg')}
          />
        </View>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/6a39f8b82dd18fd7881c2aaf9799fb58.jpg')}
          />
        </View>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/9a827e4cc84e34f2c486a82cdd8cec579fd263a27b-SELfOi_fw658.jpeg')}
          />
        </View>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/36f5294e66c20ca613f4a34bd2043319.jpg')}
          />
        </View>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/41e68c9f0359972225e0cfae4f68002b.jpg')}
          />
        </View>
        <View style={styles.photoView}>
          <Image
            style={styles.photo}
            source={require('./imgs/67af1d4e02ac3f430fd6c066f600cc97.jpg')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#1E1E1E',
  },
  photos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  photoView: {
    marginTop: 10,
    width: 120,
    height: 120,
  },
  photo: {
    width: 120,
    height: 120,
  },
});
