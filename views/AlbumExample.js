// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
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
import { showMessage } from "react-native-flash-message";

export default function AlbumExample({ navigation }) {
  const [imageShowList, setImageShowList] = useState([]);
  let imageList = [];
  let allImageList = [];
  let allImageUploaded = 0;
  const imagesPerPage = 12;
  const [imageCount, setImageCount] = useState(0);
  const [imageUploaded, setImageUploaded] = useState(0);
  // const [lastImageEndCursor, setLastImageEndCursor] = useState("");
  let lastImageEndCursor = "";
  const [granted, setGranted] = useState(false);
  // const [hasNextPage, setHasNextPage] = useState(false);
  let hasNextPage = true;
  const [modalVisible, setModalVisible] = useState(false);
  let uploading = false;
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

  const getLocalPhotos = () => {
    const config = {
      first: imagesPerPage,
      assetType: 'Photos',
      include: ['filename', 'fileSize']
    };
    if(lastImageEndCursor !== ""){
      config.after = lastImageEndCursor;
    }
    CameraRoll.getPhotos(config)
    .then(r => {
      const len = r.edges.length;
      if(len > 0){
        setGranted(true);
      }
      if(r.page_info.has_next_page){
        // setLastImageEndCursor(r.page_info.end_cursor);
        lastImageEndCursor = r.page_info.end_cursor;
        // setHasNextPage(true);
        hasNextPage = true;
      } else {
        hasNextPage = false;
      }
      // setImageList(r.edges);
      imageList = r.edges;
      allImageList = allImageList.concat(r.edges);
      setImageCount(ic => ic + r.edges.length);
      setImageShowList(allImageList);

      //如果是第二页之后，自动触发上传图片

      // setTimeout(() => {
      if (uploading) {
          onPressBackup();
        }
      // }, 50);

    }).catch(err => {
      console.log("getLocalPhotos error:", err);
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
      console.log('checkExists error: ',err);
      throw new Error('checkExists 出错了');
    }
  };

  const onPressBackup = () => {
    setModalVisible(true);
    uploading = true;
    const imagesNotUploaded = [];
    checkExists(imageList).then((list) => {
      if (!hasNextPage) {
        setImageUploaded(imageCount);
        setImageCount(0);
        setModalVisible(false);
        uploading = false;
        showMessage({
          message: "已完成同步！",
          type: "success",
        });
      } else if (list != null) {
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
                allImageUploaded = allImageUploaded + upd;
                setImageUploaded(allImageUploaded);
                resolve(r);
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
        Promise.all(promises).then(() => {
          console.log("complete a uploading!", hasNextPage);
          if(hasNextPage){
            getLocalPhotos();
          }else{
            setModalVisible(false);
            uploading = false;
            showMessage({
              message: "同步成功！",
              type: "success",
            });
          }
        }).catch(function (reason) {
          if (reason.message === 'Network Error') {
            showMessage({
              message: "网络连接失败，请检查服务器连接！",
              type: "warning",
            });
          }
          setModalVisible(false);
          uploading = false;
        });
      } else {
        allImageUploaded = allImageUploaded + imagesPerPage;
        setImageUploaded(allImageUploaded);
        getLocalPhotos();
      }
    }).catch(e => {
      console.log("捕获到错误：",e);
      setModalVisible(false);
      uploading = false;
    });
  };

  const Images = imageShowList.map((p, index) => {
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
