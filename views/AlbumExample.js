// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
import ToastExample from '../ToastExample';
import {
  PermissionsAndroid,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Button,
  Image,
  Platform,
  Modal,
  Text,
} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import * as Progress from 'react-native-progress';
import { uploadImage, uploadCheck } from '../utils/upload';
import { showMessage, hideMessage } from "react-native-flash-message";

export default function AlbumExample({ navigation }) {
  const [imageList, setImageList] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [imageUploaded, setImageUploaded] = useState(0);
  const [granted, setGranted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestReadPermission();
    } else {
      getLocalPhotos();
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
        getLocalPhotos();
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
    // CameraRoll.getPhotos({
    //   first: 40,
    //   assetType: 'All',
    //   include: ['filename', 'fileSize']
    // }).done(
    //   (data) => {
    //     //成功的回调
    //     let edges = data.edges;
    //     let photos = [];
    //     for (let i in edges) {
    //       photos.push({
    //         path: edges[i].node.image.uri,
    //         fliename: edges[i].node.image.fliename,
    //       });
    //     }
    //     setImageList(photos);
    //   },
    //   (error) => {
    //     //失败的回调
    //     Alert.alert(
    //       '权限申请',
    //       '该功能需要获取系统存储空间权限，在设置-应用-原著漫画-权限中可开启储存空间权限',
    //       [
    //         {
    //           text: '取消',
    //           style: 'cancel',
    //           onPress: () => {
    //             goBack();
    //           },
    //         },
    //         {
    //           text: '确定',
    //           onPress: () => {
    //             goBack();
    //           },
    //         },
    //       ],
    //       { cancelable: false },
    //     );
    //     console.log(error.message);
    //   },
    // );
    getLocalPhotos();
  };

  const getLocalPhotos = () => {
    CameraRoll.getPhotos({
      first: 40,
      assetType: 'All',
      include: ['filename', 'fileSize']
    })
    .then(r => {
      const len = r.edges.length;
      if(len > 0){
        setGranted(true);
      }
      setImageList(r.edges);
      setImageCount(r.edges.length);
    });
  };

  const checkExists = async (list) => {
    const _list = list.map((item) => {
      return {
        "FileName": item.node.image.filename,
        "FileSize": item.node.image.fileSize.toString()
      }
    })
    try {
      const value = await uploadCheck('uploadCheck/', _list);
      if (value.State == 1) {
        if (value.Msg === 'no data') {
          return null;
        } else {
          return value.Data;
        }
      }
    } catch (err) {
      // saving error
      console.log('checkExists error: ',err);
    }
  };

  const onPressBackup = () => {
    setModalVisible(true);
    const imagesNotUploaded = [];
    checkExists(imageList).then((list) => {
      if (list == null) {
        setImageUploaded(imageCount);
        setModalVisible(false);
        if (Platform.OS === 'android') {
          ToastExample.show('已完成同步！', ToastExample.SHORT);
        }else{
          showMessage({
            message: "已完成同步！",
            type: "success",
          });
          console.log('已完成同步！');
        }
      } else {
        imageList.forEach(item => {
          let img = item.node.image;
          JSON.parse(list).forEach(element => {
            if (element.FileName == img.filename && element.FileSize == img.fileSize) {
              imagesNotUploaded.push(item);
            }
          })
        });
        let upd = 0;
        const promises = imagesNotUploaded.map((p) => {
          return new Promise((resolve, reject) => {
            uploadImage('upload/', p.node.image)
              .then((r) => {
                upd++;
                setImageUploaded(upd);
                resolve(r);
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
        Promise.all(promises).then(() => {
          setModalVisible(false);
          if (Platform.OS === 'android') {
            ToastExample.show('同步成功！', ToastExample.SHORT);
          }else{
            showMessage({
              message: "同步成功！",
              type: "success",
            });
            console.log('同步成功！');
          }
        }).catch(function (reason) {
          if (reason.message === 'Network Error') {
            console.log('网络连接失败！');
            if (Platform.OS === 'android') {
              ToastExample.show('网络连接失败，请检查服务器连接！', ToastExample.LONG);
            }else{
              showMessage({
                message: "网络连接失败！",
                type: "warning",
              });
            }
          }
          setModalVisible(false);
        });
      }
    });
  };

  const Images = imageList.map((p, index) => {
    return (
      <View style={styles.photoView} key={index}>
        <Image style={styles.photo} source={{ uri: p.node.image.uri }} />
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
          onPress={getLocalPhotos}
          title="同步相册"
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.photos}>{Images}</View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{imageUploaded} / {imageCount}</Text>
            <Progress.Bar progress={imageUploaded / imageCount} width={200} />
          </View>
        </View>
      </Modal>
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
  photoView: {
    marginTop: 10,
    width: '33%',
    // height: '33%',
  },
  photo: {
    width: '100%',
    height: 120,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});
