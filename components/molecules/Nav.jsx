import React from 'react'
import { StyleSheet,Image , Text, View, TextInput, Dimensions, ScrollView, Pressable, Alert } from 'react-native'
import Constants from 'expo-constants'
import User from '../atoms/User'

const platform = Constants.platform
const statusBarHeight = platform.android ? 0 : Constants.statusBarHeight
const { width, height } = Dimensions.get('window')

export default function Nav({navigation}) {
    return (
        <View style={styles.nav_container} >
            <Pressable style={styles.nav_view_logo} onPress={() => navigation.navigate('Home')}>
                <Image source={require('../../assets/logo.png')} style={styles.nav_logo}/>
            </Pressable>
            <View style={styles.nav_user} >
                <User navigation={navigation}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    nav_container: {
        marginTop:statusBarHeight,
        height:80,
        width:width,
        backgroundColor: '#0a0a1e', //#353b50
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
    },
    nav_view_logo:{
        justifyContent: "center",
        height:'100%',
        width: 160,
        zIndex:10,
        margin:0,
    },
    nav_logo:{
        margin:0,
        width: null,
        resizeMode: 'contain',
        height: 35
    },
    nav_user:{
        justifyContent: "center",
    }
});
