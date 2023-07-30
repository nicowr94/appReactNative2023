import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default function Title({text, count}) {
  return (
      <View style={styles.title_content}>
        <Text style={styles.title_styles}>{text}</Text>
        { count ? <Text style={styles.title_count_styles}>({count})</Text> : null}
      </View>
  )
}

const styles = StyleSheet.create({
    title_content: {
        width:'100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        gap:3,
        paddingVertical:5,
        paddingBottom:10,
        marginBottom: 10
    },
    title_styles: {
        fontSize: 28,
        fontWeight:500,
        alignContent:'center',
    },
    title_count_styles: {
        fontSize: 28,
        fontWeight:500,
        color:'#3aabef',
        alignContent:'center',
    },


});