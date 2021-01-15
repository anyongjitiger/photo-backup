import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';
export default function ImageView({ route }) {
    const { name, uri } = route.params;
    return (
        <View>
            <Image style={{ width: "100%", height: "100%" }} resizeMode={'contain'} source={{ uri: uri }} />
            <Text style={{ marginTop: 20, textAlign: 'center' }}>{name}</Text>
        </View>
    );
}