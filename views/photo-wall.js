import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AlbumExample from './AlbumExample';
export default function PhotoWall({ navigation }) {
  return (
    <>
      <SafeAreaView>
        <View
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <AlbumExample navigation={navigation} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
