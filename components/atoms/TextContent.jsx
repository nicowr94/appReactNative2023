import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default function TextContent({name, content = ''}) {
  return (
        <View style={styles.textContent_content}>
            {
                typeof content === 'string' ? (
                    <Text style={styles.text_styles}>{content}</Text>
                ) : (
                    <>  
                       { content.map((t, index) =>{ if(t!==undefined) { return <Text key={'TextContent-'+name+"-"+index} style={styles.text_styles}>- {t}</Text>}})}
                    </>
                )
            }

        </View>
  )
}

const styles = StyleSheet.create({
    textContent_content: {
        maxWidth:'100%',
        alignItems: 'flex-start',
        gap:2,
        paddingVertical:5,
    },
    text_styles: {
        fontSize: 15,
        fontWeight:300,
        alignContent:'center',
    },

});