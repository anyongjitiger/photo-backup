// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToastExample from '../ToastExample';
import {
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Button,
  Image,
  Platform,
} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import uploadImage from '../utils/upload';
import { getData } from '../utils/global-storage';
import GlobalVar from '../utils/global-var.js';
const common_url = GlobalVar.common_url;

export default function AlbumExample({ navigation }) {
  const [photoList, setPhotoList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [remotePhotoList, setRemotePhotoList] = useState([]);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestReadPermission();
    } else {
      requestReadPermissionIOS();
    }
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const requestReadPermission = async () => {
    try {
      //返回string类型
      const _granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '权限申请',
          message: '该功能需要获取系统存储空间权限 ',
        },
      );
      if (_granted === PermissionsAndroid.RESULTS.GRANTED) {
        sync();
        setGranted(true);
      } else {
        console.log('获取读写权限失败');
        Alert.alert(
          '权限申请',
          '该功能需要获取系统存储空间权限，在设置-应用-原著漫画-权限中可开启储存空间权限',
          [
            {
              text: '取消',
              style: 'cancel',
              onPress: () => {
                goBack();
              },
            },
            {
              text: '确定',
              onPress: () => {
                goBack();
              },
            },
          ],
          { cancelable: false },
        );
      }
    } catch (err) {
      console.log(err.toString());
    }
  };

  const requestReadPermissionIOS = () => {
    CameraRoll.getPhotos({
      first: 10000,
      assetType: 'Photos',
    }).done(
      (data) => {
        //成功的回调
        let edges = data.edges;
        let photos = [];
        for (let i in edges) {
          photos.push({
            path: edges[i].node.image.uri,
            fliename: edges[i].node.image.fliename,
          });
        }
        setPhotoList(photos);
      },
      (error) => {
        //失败的回调
        Alert.alert(
          '权限申请',
          '该功能需要获取系统存储空间权限，在设置-应用-原著漫画-权限中可开启储存空间权限',
          [
            {
              text: '取消',
              style: 'cancel',
              onPress: () => {
                goBack();
              },
            },
            {
              text: '确定',
              onPress: () => {
                goBack();
              },
            },
          ],
          { cancelable: false },
        );
        console.log(error.message);
      },
    );
  };

  const getRemotePhotos = () => {
    axios
      .get(common_url + 'albums/all', {
        headers: {
          // 'Content-Type': 'multipart/form-data;',
          // 'x-access-token': token
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const dataArray = response.data.Data;
          let tempAry = [];
          for (let v of dataArray) {
            tempAry.push(`${common_url}show//${v.FileName}`);
          }
          setRemotePhotoList(tempAry);
        } else {
          console.log(response);
        }
      })
      .catch(function (error) {
        console.log("getRemotePhotos: ", error);
      })
      .then(function () {
        // always executed
      });
  };

  const getLocalPhotos = () => {
    NativeModules.GetLocalPhotos.getAllPhotoInfo().then((res) => {
      const resp = JSON.parse(res);
      console.log("photo", resp);
      setPhotoList(resp);
    }).catch((err) => {
      console.log('err', err);
    });
  };
  const getLocalPhotos2 = () => {
    console.log(CameraRoll);
    CameraRoll.getPhotos({
      first: 40,
      assetType: 'All',
    })
      .then(r => {
        console.log(r.edges);
      })
      .catch((err) => {
        //Error Loading Images
      });
  };

  const getLocalVideos = () => {
    NativeModules.GetLocalVideos.getAllVideoInfo()
      .then((res) => {
        const resp = JSON.parse(res);
        console.log("video", resp);
        setVideoList(resp);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const onPressBackup = () => {
    const promises = [...photoList, ...videoList].map((p) => {
      return new Promise((resolve, reject) => {
        uploadImage('upload/', p.path)
          .then((r) => {
            resolve(r);
          })
          .catch((err) => {
            console.log('err', err);
            reject(err);
          });
      });
    });
    Promise.all(promises).then(() => {
      ToastExample.show('同步成功！', ToastExample.SHORT);
    });
  };

  const sync = () => {
    getLocalPhotos();
    getLocalVideos();
    getLocalPhotos2();
  };

  const views = photoList.map((p, index) => {
    return (
      <View style={styles.photoView} key={index}>
        <Image style={styles.photo} source={{ uri: p.path }} />
      </View>
    );
  });
  const remotePhotos = remotePhotoList.map((p, index) => {
    return (
      <View style={styles.photoView} key={index}>
        <Image style={styles.photo} source={{ uri: p }} />
      </View>
    );
  });
  const VideoThumbs = videoList.map((p, index) => {
    return (
      <View style={styles.photoView} key={index}>
        <Image style={styles.photo}
          source={{ uri: `data:image/jpeg;base64,${p.thumbPath}` }} />
      </View>
    );
  });
  return (
    <View>
      <View style={{ height: 80 }}>
        <Button
          onPress={onPressBackup}
          title="上传"
          color="#841584"
          disabled={!granted}
        />
        <Button
          onPress={sync}
          title="同步相册"
        />
        {/* <Button
          title="Go to Login"
          onPress={() => navigation.navigate('Login')}
        /> */}
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.photos}>{views}</View>
        <View style={styles.videos}>{VideoThumbs}</View>
        {/* <View style={styles.photos}>{remotePhotos}</View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#1E1E1E',
  },
  photos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  videos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    backgroundColor: 'lightgreen',
  },
  photoView: {
    marginTop: 10,
    width: '33%',
    // height: '33%',
  },
  photo: {
    width: '100%',
    height: 120,
  },
});
