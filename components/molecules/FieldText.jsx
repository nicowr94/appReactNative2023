import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import TextContent from '../atoms/TextContent';
import SubTitle from '../atoms/SubTitle';

export default function FieldText({title, text, row = false}) {
    const addStyle = {
        marginBottom:5,
        flexDirection: 'row',
        alignItems: 'center',
        gap:5
    }
    return (
        <View style={row ? addStyle : styles.fieldText_content}>
            <SubTitle content = {title}/>
            <TextContent content = {text} />
        </View>
    )
}

const styles = StyleSheet.create({
    fieldText_content: {
        marginBottom:5,
    },
});