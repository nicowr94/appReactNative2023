import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function BtnBack({navigation}) {
  return (
      <Pressable style={styles.BtnBack_cotnainer} onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
        <MaterialCommunityIcons name={'chevron-left'} size={30} color="#232323c7" style={styles.BtnBack_icon}/>
        <Text  style={styles.BtnBack_text}> {'Regresar'}</Text>
      </Pressable>
  )
}

const styles = StyleSheet.create({
    BtnBack_cotnainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'flex-start',
      paddingVertical:5,
    },
    BtnBack_icon:{
        height:'100%'
    },
    BtnBack_text: {
        left: -7,
        fontSize:17
    },

});