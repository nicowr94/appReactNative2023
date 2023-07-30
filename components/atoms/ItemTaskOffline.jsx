import React from 'react'
import { StyleSheet, Pressable , Text, View } from 'react-native'
import { formatDateType } from '../../utils/dateFormat';
import Timer from './Timer';

export default function ItemTaskOffline({item, index}) {
    return (
        // Flat List Item
        <View style={styles.item_container}>
            <View style={styles.itemStyle}>
                <Text style={styles.itemStyle_text}>
                <Text style={styles.itemStyle_text_subtitle}>ID:</Text> { ("000"+(index+1)).slice(-3)}
                </Text>
                <Text style={styles.itemStyle_text}>
                <Text style={styles.itemStyle_text_subtitle}>Inicio:</Text> 
                    { formatDateType(item?.fecha_hora_inicio, 'DD/MM/YYYY HH:MM:SS')} ({<Timer date_start = {new Date (item?.fecha_hora_inicio)} date_end = {new Date (item?.fecha_hora_termino)} mini={true}  activated={false}/>})
                </Text>
            </View>

            <View style={styles.itemStyle}>
                <Text style={styles.itemStyle_text}>
                <Text style={styles.itemStyle_text_subtitle}>Comentario:</Text> { item.comentario ? item.comentario : '---'}
                </Text>
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
      gap: 0,

    },
    itemStyle: {
      padding: 10,
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 15,

    },
    itemStyle_text:{
      maxWidth: '100%',
      height: '100%',
      flexDirection: 'row',
      alignItems: "center",
      textAlignVertical: 'bottom',

    },
    itemStyle_icon:{
      flex:1,
      maxWidth: '8%',
    },
    itemStyle_break:{
      width: '100%',
      alignItems: "center",

    },
    itemStyle_text_subtitle:{
        fontWeight:600
    }
});