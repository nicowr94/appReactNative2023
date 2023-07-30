import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BtnCreate() {
  return (
    <View  style={styles.BtnCreate_container}>
        <MaterialCommunityIcons name={'plus'} size={35} color="white" />
        <Text style={styles.BtnCreate_text}>Nueva actividad</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    BtnCreate_container: {
        backgroundColor: '#3ec6ac',
        flexDirection: 'row',
        gap:5,
        height:50,
        alignItems: 'center',
        justifyContent:'center',
        paddingHorizontal:10,
        marginVertical: 10,
    },
    BtnCreate_text:{
      fontWeight: 500,
      fontSize: 18
    }
});