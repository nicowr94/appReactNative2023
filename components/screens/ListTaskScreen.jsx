import {useContext} from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import BtnCreate from '../atoms/BtnCreate'
import SubTitle from '../atoms/SubTitle'
import {UserContext} from '../../src/context/UserProvider';
import ListActivities from '../molecules/ListActivities'
import Layout from '../templates/Layout'

export default function ListTaskScreen({navigation}) {
  const { projectOpen, user } = useContext(UserContext);

  return (
    <Layout style={styles.layout} navigation={navigation} >
     
        <View style={styles.container}>
            <View style={styles.header}>
                <SubTitle content={'Lista de actividades del proyecto: \n'+ projectOpen?.cod_nisira} fontSize={19}  paddingBottom={10}/>
              
            </View>
            <ListActivities navigation={navigation}/>

            { user.rol === 1 && !projectOpen.f_terminado
                ?
                <Pressable onPress={() => {navigation.navigate('CreateTask') }}>
                    <BtnCreate />
                </Pressable>
                : null
              }
            
        </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
    layout:{
      height:'100%',
      borderWidth: 1,
      borderColor: 'red',
      borderStyle: 'solid',
    },
    container: {
        backgroundColor: 'transparent',
        height:'100%'
    },
    header:{
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        gap:10,
    }
  });