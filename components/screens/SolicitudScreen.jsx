import {useContext, useEffect, useState} from 'react'
import { View, StyleSheet } from 'react-native'
import SubTitle from '../atoms/SubTitle'
import {UserContext} from '../../src/context/UserProvider';
import Layout from '../templates/Layout'
import ListItem from '../molecules/ListItem';
import { getSolicitudes } from '../../utils/servicesApi';

export default function SolicitudScreen({navigation}) {
  const { user } = useContext(UserContext);
  const [list, setList] = useState([]);

  async function getElements(){

        const res = await getSolicitudes(user.token, user.id)
        setList(res)
  };

  useEffect(() => {
        getElements()
  }, [])
  return (
    <Layout style={styles.layout} navigation={navigation} >
     
        <View style={styles.container}>
            <View style={styles.header}>
                <SubTitle content={'Lista de solicitudes: '} fontSize={19}  paddingBottom={10}/>
              
            </View>
            <ListItem navigation={navigation} elements={list}/>
            
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