import React, {Component} from 'react';
import axios from 'axios';
import ToastExample from '../ToastExample';
import {
  NativeModules,
  PermissionsAndroid,
  CameraRoll,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Button,
  Image,
  Platform,
} from 'react-native';
import uploadImage from '../utils/upload';
import {getData} from '../utils/global-storage';
const common_url = global.common_url;
export default class AlbumExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoList: [],
      videoList: [],
      remotePhotoList: [],
      granted: false,
    };
  }

  componentDidMount() {
    getData().then((v) => {
      console.log(v);
      if (v === undefined) {
        console.log(this.props);
        // this.props.navigation.navigate('Login');
      }
    });
    if (Platform.OS === 'android') {
      this.requestReadPermission();
    } else {
      this.requestReadPermissionIOS();
    }
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  requestReadPermission = async () => {
    try {
      //返回string类型
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '权限申请',
          message: '该功能需要获取系统存储空间权限 ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({granted: true});
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
                this.goBack();
              },
            },
            {
              text: '确定',
              onPress: () => {
                this.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (err) {
      console.log(err.toString());
    }
  };

  requestReadPermissionIOS = () => {
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
        this.setState({
          //通过打印的object，找到如下图片路径
          photoList: photos,
        });
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
                this.goBack();
              },
            },
            {
              text: '确定',
              onPress: () => {
                this.goBack();
              },
            },
          ],
          {cancelable: false},
        );
        console.log(error.message);
      },
    );
  };

  getRemotePhotos = () => {
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
          this.setState({
            remotePhotoList: tempAry,
          });
        }
      })
      .catch(function (error) {
        // err
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  getLocalPhotos = () => {
    NativeModules.GetLocalPhotos.getAllPhotoInfo().then((res) => {
      const resp = JSON.parse(res);
      this.setState({
        photoList: JSON.parse(res),
      });
      /* resp.forEach((p) => {
        uploadImage('upload/', p.path)
          .then((r) => {
            console.log(r);
          })
          .catch((err) => {
            console.log('err', err);
          });
      }); */
      const promises = resp.map((p) => {
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
        this.getRemotePhotos();
        ToastExample.show('同步成功！', ToastExample.SHORT);
      });
      /* uploadImage('upload/', JSON.parse(res)[3].path)
        .then((r) => {
          console.log(r);
        })
        .catch((err) => {
          console.log('err', err);
        }); */
    });
    /* const {GetLocalPhotos} = NativeModules;
    GetLocalPhotos.getAllPhotoInfo().then((res) => {
      console.log(res);
      this.setState({
        photoList: JSON.parse(res),
      });
    }); */
  };

  getLocalVideos = () => {
    NativeModules.GetLocalVideos.getAllVideoInfo()
      .then((res) => {
        const resp = JSON.parse(res);
        this.setState({
          videoList: resp,
        });
        const promises = resp.map((p) => {
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
          // this.getRemotePhotos();
          ToastExample.show('同步视频成功！', ToastExample.SHORT);
        });
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  onPressSync = () => {
    this.getLocalPhotos();
    this.getLocalVideos();
  };

  render() {
    const views = this.state.photoList.map((p, index) => {
      return (
        <View style={styles.photoView} key={index}>
          <Image style={styles.photo} source={{uri: p.path}} />
        </View>
      );
    });
    const remotePhotos = this.state.remotePhotoList.map((p, index) => {
      return (
        <View style={styles.photoView} key={index}>
          <Image style={styles.photo} source={{uri: p}} />
        </View>
      );
    });
    const VideoThumbs = this.state.videoList.map((p, index) => {
      return (
        <View style={styles.photoView} key={index}>
          <Image style={styles.photo} source={{uri: p.thumbPath}} />
        </View>
      );
    });
    return (
      <View>
        <View style={{height: 45}}>
          <Button
            onPress={this.onPressSync}
            title="BACK UP"
            color="#841584"
            disabled={!this.state.granted}
          />
          <Button
            title="Go to Login"
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.photos}>{views}</View>
          <View style={styles.videos}>{VideoThumbs}</View>
          {/* <View style={styles.photos}>{remotePhotos}</View> */}
        </ScrollView>
      </View>
    );
  }
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
