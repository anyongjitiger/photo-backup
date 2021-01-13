// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect, useReducer } from 'react';
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
import useDeepCompareEffect from 'use-deep-compare-effect';
import CameraRoll from "@react-native-community/cameraroll";
import * as Progress from 'react-native-progress';
import { uploadImage, uploadCheck } from '../utils/upload';
import { showMessage } from "react-native-flash-message";

export default function Album({ navigation }) {
  const [readPermission, setReadPermission] = useState(false);
  const [granted, setGranted] = useState(false);
  const [visitAlbumsTimes, setVisitAlbumsTimes] = useState(0);
  const [imageTotal, setImageTotal] = useState(0);
  const [uploadedPages, setUploadedPages] = useState(0);
  const [imagesNotUploaded, setImagesNotUploaded] = useState([]);
  const initialState = {
    uploading: false,
    hasNextPage: true,
    lastImageEndCursor: "",
    imageList: [],
    imageShowList: [],
    imageUploadedCount: 0
  };
  const imagesReducer = (_state, action) => {
    switch (action.type) {
      case "FETCH_IMG": {
        return {
          ..._state,
          imageList: action.payload.imageList,
          imageShowList: _state.imageShowList.concat(action.payload.imageList),
          hasNextPage: action.payload.hasNextPage,
          lastImageEndCursor: action.payload.lastImageEndCursor
        };
      }
      case "UPLOADING": {
        return {
          ..._state,
          uploading: true
        }
      }
      case "UPLOADED": {
        return {
          ..._state,
          imageUploadedCount: _state.imageUploadedCount + action.payload.uploaded
        }
      }
      case "UPLOAD_COMPLETE": {
        return {
          ..._state,
          uploading: false
        }
      }
      case "RESET": {
        return initialState;
      }
      default:
        throw new Error(`Not supported action ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(imagesReducer, initialState);

  const goBack = () => {
    navigation.goBack();
  };

  const sync = () => {
    setVisitAlbumsTimes(v => v + 1);
    dispatch({ type: 'RESET' });
  }

  const requestReadPermission = async () => {
    try {
      const _granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '权限申请',
          message: '该功能需要获取系统存储空间权限 ',
        },
      );
      if (_granted === PermissionsAndroid.RESULTS.GRANTED) {
        // getAlbums();
        setReadPermission(true);
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

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestReadPermission();
    } else {
      setReadPermission(true);
    }
  }, []);

  useEffect(() => {
    const getAlbums = () => {
      CameraRoll.getAlbums({ 'assetType': 'All' }).then(r => {
        const imgCount = r.reduce((pre, cur) => {
          return (pre + cur.count);
        }, 0);
        setImageTotal(imgCount);
      });
    };
    if (readPermission) {
      getAlbums();
    }
  }, [readPermission, visitAlbumsTimes]);

  useEffect(() => {
    const getLocalPhotos = () => {
      const config = {
        first: 12,
        assetType: 'All',
        // groupName: 'sexy',
        include: ['filename', 'fileSize']
      };
      if (state.lastImageEndCursor !== "" && state.lastImageEndCursor !== "last") {
        config.after = state.lastImageEndCursor;
      }
      CameraRoll.getPhotos(config)
        .then(r => {
          const len = r.edges.length;
          if (len > 0) {
            setGranted(true);
          }
          dispatch({
            type: 'FETCH_IMG',
            payload: {
              imageList: r.edges,
              hasNextPage: r.page_info.has_next_page,
              lastImageEndCursor: r.page_info.end_cursor || 'last'
            }
          });
        }).catch(err => {
          console.log("getLocalPhotos error:", err);
        });
    };
    if (imageTotal > 0 && (state.lastImageEndCursor != undefined)) {
      getLocalPhotos();
    }
  }, [uploadedPages, imageTotal, visitAlbumsTimes]);

  useDeepCompareEffect(() => {
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
        console.log(err);
        if (err.response && err.response.status === 401) {
          navigation.navigate('Login');
        }
        throw new Error('checkExists error!');
      }
    };
    if (state.uploading && state.imageList.length > 0) {
      checkExists(state.imageList).then((list) => {
        const notUploaded = [];
        if (list != null) {
          state.imageList.forEach(item => {
            let img = item.node.image;
            JSON.parse(list).forEach(element => {
              if (element.FileName == img.filename && element.FileSize == img.fileSize) {
                notUploaded.push(item);
              }
            })
          });
          setImagesNotUploaded(notUploaded);
        } else {
          if (!state.hasNextPage) {
            dispatch({ type: 'UPLOAD_COMPLETE' });
            showMessage({
              message: "已完成同步！",
              type: "success",
            });
          } else {
            if (state.imageList.length > 0) {
              setUploadedPages(n => n + 1);
              dispatch({
                type: 'UPLOADED',
                payload: { 'uploaded': state.imageList.length }
              });
            }
          }
        }
      }).catch(e => {
        console.log("捕获到错误：", e);
        dispatch({ type: 'UPLOAD_COMPLETE' });
      });
    }
  }, [state.imageList, state.uploading]);

  useDeepCompareEffect(() => {
    const backup = () => {
      let promises = imagesNotUploaded.map((p) => {
        return new Promise((resolve, reject) => {
          uploadImage('upload/', p.node.image)
            .then((r) => {
              dispatch({
                type: 'UPLOADED',
                payload: { 'uploaded': 1 }
              });
              resolve(r);
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
      Promise.all(promises).then(() => {
        if (!state.hasNextPage) {
          dispatch({ type: 'UPLOAD_COMPLETE' });
          showMessage({
            message: "同步完成！",
            type: "success",
          });
        } else {
          setUploadedPages(n => n + 1);
        }
      }).catch(function (reason) {
        if (reason.message === 'Network Error') {
          showMessage({
            message: "网络连接失败，请检查服务器连接！",
            type: "warning",
          });
        }
        dispatch({ type: 'UPLOAD_COMPLETE' });
      });
    };
    if (state.uploading && imagesNotUploaded.length > 0) {
      backup();
    }
  }, [imagesNotUploaded]);

  const Images = state.imageShowList.map((p, index) => {
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
          onPress={() => { dispatch({ type: 'UPLOADING' }) }}
          title="上传"
          color="#841584"
          disabled={!granted}
        />
        <Button
          onPress={sync}
          title="同步相册"
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.photos}>{Images}</View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={state.uploading}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{state.imageUploadedCount} / {imageTotal}</Text>
            <Progress.Bar progress={state.imageUploadedCount / imageTotal} width={200} />
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
