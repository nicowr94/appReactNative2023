import {useState, useEffect, useContext} from 'react';
import Nav from '../molecules/Nav'
import { StyleSheet, Dimensions, Button, View, Text, ToastAndroid } from 'react-native'
import BtnBack from '../atoms/BtnBack'
import Constants from 'expo-constants'
import  {useNetInfo} from "@react-native-community/netinfo";
import {UserContext} from '../../src/context/UserProvider';
import { closedProjectByID, postSaveAsistencia } from '../../utils/servicesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'

const { width, height } = Dimensions.get('window')
const platform = Constants.platform
const marginRightPlatform = platform.android ? 10 : 15

export default function Layout ({children, navigation, btn_back = true}) {
    const { net, setNet,geo, setGeo, dataOffline, setDataOffline, user } = useContext(UserContext);
    const netInfo = useNetInfo();



    useEffect(() => {
        autoAsistenciaAndProjectClosed()
        // getPermissions ()
    } );
    
    useEffect(() => {
        // setNet(false) 
        setNet(netInfo.isConnected && netInfo.isInternetReachable) 
        autoAsistenciaAndProjectClosed()
    }, [netInfo.isConnected, netInfo.isInternetReachable]);
    
  
    const autoAsistenciaAndProjectClosed = async () => { // sincronizarAsistenciaYCerrarProjectoAutomaticamente
        if( !net ) return

        // sincronizar projectos cerrados
        let porjectsOffline = dataOffline?.projectClosed ? dataOffline?.projectClosed : []

        // Comenzar a recorrer el array de proyectos cerrados
        for (let i = 0; i < porjectsOffline.length; i++){
            if( !net ) {
                break
            }

            // const project = porjectsOffline[i]
            
            const project = (porjectsOffline.splice(-1,1))[0]

            const res = await closedProjectByID(user.token, project.id, project.date)
            // res.detail === "El proyecto se ha terminado"
            const now = new Date()
            const newDataOffline = {...dataOffline, lastmodified: now, projectClosed: porjectsOffline }
            setDataOffline(newDataOffline)
            await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
        }

        if( !net ) return
        // sincronizar las asistencias
        let asistenciasOfflineList = dataOffline.asistenciasOffline ? dataOffline.asistenciasOffline : []

        // Comenzar a recorrer el array de asistencias
        for (let i = 0; i < asistenciasOfflineList.length; i++){
            if( !net ) {
                break
            }

            // const project = porjectsOffline[i]
            
            const asistencia = (asistenciasOfflineList.splice(-1,1))[0]

            const res = await postSaveAsistencia(user.token, asistencia.data)

            const now = new Date()
            const newDataOffline = {...dataOffline, lastmodified: now, asistenciasOffline: asistenciasOfflineList }
            setDataOffline(newDataOffline)
            await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
        }
        // showToast()

    };

    const showToast = () => {
        ToastAndroid.show(' Proyectos cerrados sincronizados!', ToastAndroid.SHORT);
      };

    // {"details": {"bssid": "02:00:00:00:00:00", "frequency": 2452, "ipAddress": "192.168.18.7", "isConnectionExpensive": false, "linkSpeed": 130, "rxLinkSpeed": 130, "strength": 99, "subnet": "255.255.255.0", "txLinkSpeed": 130}, "isConnected": true, "isInternetReachable": true, "isWifiEnabled": true, "type": "wifi"}

    return (
        <View style={styles.mainContainer} > 
            <Text style={ net ? styles.info_IsConnected : styles.info_IsNotConnected } >
                {net ? 'Conectado': 'Modo offline'}
            </Text>
            <Nav navigation={navigation}/>
            <View style={styles.container}>
                { (btn_back) ? (<BtnBack navigation={navigation}/>) : null}
                <View style={styles.container_children}>
                    {children}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#f1f1f1', //f1f1f1
        flex:1,
    },
    container:{
        padding:10,
        paddingRight:marginRightPlatform,
        flex:1,
    },
    container_children:{
        flex:1,
    },
    info_IsConnected:{
        backgroundColor:'#33c032',
        height:30,
        textAlign:'center',
        color:'white',
        textAlignVertical: 'center',
        fontWeight: 500,

        display: 'none'
    },
    info_IsNotConnected:{
        backgroundColor:'red',
        height:30,
        textAlign:'center',
        color:'white',
        textAlignVertical: 'center',
    }
});