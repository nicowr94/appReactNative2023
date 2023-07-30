import {useContext, useEffect, useState} from 'react'
import { View, StyleSheet, Pressable, Text, Alert } from 'react-native'
import SubTitle from '../atoms/SubTitle'
import {UserContext} from '../../src/context/UserProvider';
import Layout from '../templates/Layout'
import ListItem from '../molecules/ListItem';
import { getSolicitudes } from '../../utils/servicesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postCreateActivitiesByCotizacion } from '../../utils/servicesApi';

export default function TaskOfflineScreen({navigation}) {
    const { dataOffline, setDataOffline, net, user } = useContext(UserContext);
    const [list, setList] = useState([]);
    const [totalTaskOffline, setTotalTaskOffline] = useState(0);

    async function getElements(){

        const res = dataOffline?.tasksOffline
        setList(res)
        setTotalTaskOffline(res?.length || 0)
    };

    useEffect(() => {
        getElements()
    }, [])

    const alertSincronizarTareas = async () =>{
        let message = 'Antes de sincronizar las actividades asegurese de tener conexión a internet estable\n\n¿Está seguro que desea sincronizar las actividades?'
        let options = [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {text: 'Continuar', onPress: () => {alertSincronizandoTareas()},
            style: 'default'
           },
          ]
        if (!net) {
            message = 'Debe estar conectado al internet para poder sincronizar las tareas'
            options = [
                {text: 'Ok',
                style: 'default'
               },
              ]
        }

        if (totalTaskOffline === 0) {
            message = 'No hay tareas para sincronizar'
            options = [
                {text: 'Ok',
                style: 'default'
               },
              ]
        }
        Alert.alert('Sincronizar tareas', message, options)

    }

    const [option, setOption] = useState([]);
    // const [option, setOption] = useState([{text: 'Continuar',style: 'default'}]);

    const alertSincronizandoTareas = async () =>{

        Alert.alert(
            'Sincronizando tareas',
            'Se está sincronizando las tareas, no cierres la aplicación mientras se está sincronizando las tareas',
            option,
            { cancelable: false }
        )
        postListDataOffline()
    }


    const postListDataOffline = async () =>{
        console.log('postListDataOffline ', totalTaskOffline);
        let messageFinish = totalTaskOffline > 1 ? 'Se terminó la sincronización de ' + totalTaskOffline+ ' tareas correctamente' : 'Se terminó la sincronización de ' + totalTaskOffline+ ' tarea correctamente'

        // const listTaskOffline = dataOffline.tasksOffline ? dataOffline.tasksOffline : []
        // listTaskOffline.push(activities)
        // const newDataOffline = {...dataOffline, lastmodified: end_task, tasksOffline: listTaskOffline }
        // setDataOffline(newDataOffline)
        // await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));

        let listTaskOffline = dataOffline.tasksOffline ? dataOffline.tasksOffline : []
        const numberTaskOffline = listTaskOffline?.length || 0

        // Comenzar a recorrer el array de tareas offline
        for (let i = 0; i < numberTaskOffline; i++){
            console.log(i);

            if( !net ) {
                messageFinish = 'Se perdió la conexión con el internet, conéctese a una red estable para continuar'
                break
            }

            const activity = (listTaskOffline.splice(-1,1))[0]
            console.log(activity);

            const res = await postCreateActivitiesByCotizacion(user.token, [activity])
            console.log(res);

            if(res.detail === 'Actividades creadas correctamente') {
                const now = new Date()
                const newDataOffline = {...dataOffline, lastmodified: now, tasksOffline: listTaskOffline }
                setDataOffline(newDataOffline)
                await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
            }else {
                console.log('listTaskOffline', listTaskOffline);
                listTaskOffline.push(activity)
                console.log('listTaskOffline 2', listTaskOffline);
                break
            }
        }
        
        setOption([{text: 'Aceptar',style: 'default'}])
        Alert.alert(
            'Sincronizando tareas',
            // 'Se terminó la sincronización de' + totalTaskOffline+ ' tareas correctamente',
            messageFinish,
            [{text: 'Aceptar', onPress: () => null, style: 'default'}],
            { cancelable: false }
        )
    }

    return (
        <Layout style={styles.layout} navigation={navigation} >
        
            <View style={styles.container}>
                <View style={styles.header}>
                    <SubTitle content={'Lista de tareas offline: '} fontSize={19}  paddingBottom={10}/>
                
                </View>
                <ListItem navigation={navigation} elements={list} filter={false}/>
                <Pressable style={styles.button_get} onPress={() => alertSincronizarTareas()}>
                    <Text style={styles.button_closed_text}>Sincronizar tareas</Text> 
                </Pressable >
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
    },
    button_closed_text:{
        color: 'white',
        fontWeight: 500,
        fontSize: 16,
        flex:1,
        textAlignVertical: 'center'
      },
      button_get:{
        marginTop:10,
        height: 60,
        width:'100%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#3ec6ac',
        color: 'white',
      },
  });