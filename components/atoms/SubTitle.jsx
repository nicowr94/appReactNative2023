import React from 'react'
import { Text } from 'react-native'

export default function SubTitle({content, fontSize = 18, paddingBottom = 0}) {
  return (
    <Text style={ {maxWidth:'100%', fontWeight:600, paddingVertical: 0, fontSize, paddingBottom}}>{content}</Text>
  )
}