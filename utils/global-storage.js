// import {AsyncStorage} from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
  }
};



const clearStorage = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
  }
}

export { setData, getData, clearStorage };
