import React from 'react'
import { StyleSheet, Pressable , Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ItemSolicitud({item, navigation}) {
    return (
        // Flat List Item
        <View style={styles.item_container}>
            <View style={styles.itemStyle}>
                <Text style={styles.itemStyle_text}>
                {item?.label}
                </Text>
                <Pressable style={styles.itemStyle_icon}  onPress={ async() => {

                    navigation.navigate('SolicitudDetail',{solicitud: item}) 
                }}>
                <MaterialCommunityIcons name={'chevron-right'} size={30} color="#232323c7"/>
                </Pressable>
            </View>
            <View style={styles.itemStyle_break}>
                <View style={{  height: 1, width:'95%',backgroundColor:'#cfcfd1'}}></View>
            </View>
        </View>
  )
}


const styles = StyleSheet.create({

    item_container:{
      flex:1,
      maxWidth: '100%',
      justifyContent: 'center',
    },
    itemStyle: {
      padding: 10,
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemStyle_text:{
      maxWidth: '90%',
      flex:1,
    },
    itemStyle_icon:{
      flex:1,
      maxWidth: '8%',
    },
    itemStyle_break:{
      width: '100%',
      alignItems: "center",

    },
});