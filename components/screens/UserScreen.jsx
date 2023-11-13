import {useContext, useEffect, useState} from 'react'
import {UserContext} from '../../src/context/UserProvider';
import { View, StyleSheet, Text, Pressable, Alert} from 'react-native'
import LogOut from '../atoms/LogOut'
import UserPerfil from '../atoms/UserPerfil'
import SubTitle from '../atoms/SubTitle';
import { getSolicitudes, postSaveAsistencia } from '../../utils/servicesApi';
import { formatDateType } from '../../utils/dateFormat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locationUser from '../../utils/locationUser';

export default function UserScreen({navigation}) {

  const { user, net, geo, dataOffline, setDataOffline, asistencias, setAsistencias } = useContext(UserContext);
  const taskOffline = (dataOffline?.tasksOffline?.length < 10 ? ('0'+ dataOffline?.tasksOffline?.length).slice(-2) : dataOffline?.tasksOffline?.length ) || '00'
  const [solicitudes, setSolicitudes] = useState('00');
  const [asistenciaHoy, setAsistenciaHoy] = useState({});
  const [loading, setLoading] = useState(true);
  const [permisosSolicitados, setPermisosSolicitados] = useState(false);

  const ubicacion = locationUser({permisosSolicitados})
  const now = formatDateType(new Date(),'DD/MM/YYYY')


  useEffect(() => {
    const solicitarPermisos = async () => {
      if (!permisosSolicitados) {
        try {
          const resultadoPermisos = await ubicacion;
          console.log("Permisos obtenidos:", resultadoPermisos);
          // Hacer algo con la ubicación...
        } catch (error) {
          console.error("Error al obtener permisos o ubicación:", error);
          // Manejar el error...
        } finally {
          setPermisosSolicitados(true);
        }
      }
    };

    solicitarPermisos();
  }, [ubicacion, permisosSolicitados]);

  async function getElements(){
    const res = (await getSolicitudes(user.token, user.id))?.length || 0
    setSolicitudes(res < 10 ? '0'+ res : res)
    // await AsyncStorage.setItem('asistencias', JSON.stringify('')); await AsyncStorage.setItem('dataOffline', JSON.stringify(''));

    const today = (asistencias?.length>0 ? asistencias?.find(a => a?.date=== now)?.data : {}) || {}
    // "tecnico": 3,
    //   "fecha_hora_ingreso": "2023-05-04 9:51:52",
    //   "fecha_hora_salida": "2023-05-04 9:51:52"
    setAsistenciaHoy(today)
    setLoading(false)
  };

  useEffect(() => {
      getElements()
      
  }, [])

  
  const alertPostAsistenciasAPI = async (type) =>{
    const position = geo?.stringData || ''
    const title = type === 1 ? 'Registrar ingreso' : 'Registrar salida'

    if (type === 1 && position === 'null'){
      const desc = 'Es necesario activar el GPS del dispositivo'
      Alert.alert(title, desc, [
        {text: 'Ok', onPress: () => {
        },style: 'default'
      },
      ])
    } else {
      const desc = type === 1 ? '¿Está seguro que desea registrar su hora de ingreso?' : '¿Está seguro que desea registrar su hora de salida?'
      Alert.alert(title, desc, [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {text: 'Ok', onPress: () => {
          setAsistenciasAPI(type)
        },style: 'default'
      },
      ])
    }

}

  async function setAsistenciasAPI(type){

    const now_save = formatDateType(new Date(),'YYYY/MM/DD HH:MM:SS')
    const now_form = formatDateType(new Date(),'DD/MM/YYYY')
    let position = geo?.stringData || ''
    if (position === 'null' && type === 2 ) position = asistenciaHoy?.lat_long_ingreso
    const data = {
      "tecnico": user.id,
      "fecha_hora_ingreso":  type === 1 ? now_save : asistenciaHoy?.fecha_hora_ingreso,
      "fecha_hora_salida": type === 1 ? null : now_save,
      "lat_long_ingreso": type === 1 ? position : asistenciaHoy?.lat_long_ingreso,
      "lat_long_salida":  type === 1 ? null : position,
    }
    console.log(data)
    if (false){
      const res = await postSaveAsistencia(user.token, data)
    } else {
      const asistenciasOffline = dataOffline.asistenciasOffline ? dataOffline.asistenciasOffline : []
      let found = false

      for( let i = 0; i < asistenciasOffline?.length; i++){ //buscamos si existe un registro de la fecha para actualizarlo
        if(asistenciasOffline[i].date === now_form){
          asistenciasOffline[i].data = data;
          found = true
          break
        }
      }
      if(!found) asistenciasOffline.push({date: now_form, data}) // si no se encuentra el registro de la fecha se crea un nuevo registro en la lista
      // listTaskOffline.push(activities)
      const newDataOffline = {...dataOffline, lastmodified: now, asistenciasOffline}
      setDataOffline(newDataOffline)
      await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
    }

    // Despues de enviar la informacion al server u offline se guarda la información localmente

    const newAsistencias = asistencias || []
    let found = false
    for( let i = 0; i < newAsistencias?.length; i++){ //buscamos si existe un registro de la fecha para actualizarlo
      if(newAsistencias[i].date === now_form){
        newAsistencias[i].data = data;
        found = true
        break
      }
    }

    if(!found) newAsistencias.push({date: now_form, data}) // si no se encuentra el registro de la fecha se crea un nuevo registro en la lista

    setAsistencias(newAsistencias)
    await AsyncStorage.setItem('asistencias', JSON.stringify(newAsistencias));
    setAsistenciaHoy(data)
  };

  return (
    <View style={styles.user_container} >
      <View style={ styles.user_container_options}>
        <Text style={styles.name_user}>{user.first_name}</Text>
        <Text style={styles.rol_user}>{user.rol === 1 ? "Tecnico" : "Coordinador"}</Text>
        <UserPerfil />

        <View style={ styles.menu_user}>
            <Pressable style={ styles.menu_options } onPress={() => navigation.navigate('TaskOffline')} > 
                <Text style={ styles.menu_options_text }>{'Lista de tareas offline'}</Text>
                <View style={ styles.menu_options_alert }><Text style={{color:'white'}}>{taskOffline}</Text></View>
            </Pressable>
            <Pressable style={ styles.menu_options } onPress={() => navigation.navigate('Solicitud')} > 
                <Text style={ styles.menu_options_text }>{'Solicitudes de cambio'}</Text>
                <View style={ styles.menu_options_info }><Text style={{color:'white'}}>{solicitudes}</Text></View>
            </Pressable>
        </View>
        <Text style={styles.asistencia}>{"Asistencia del día " + now + ":"}</Text>
        {
          asistenciaHoy?.fecha_hora_ingreso
          ? <Text style={ styles.menu_asistencia_options_text }>{'Hora de ingreso: ' + asistenciaHoy.fecha_hora_ingreso.split(' ')[1]}</Text>
          : null
        }
        {
          asistenciaHoy?.fecha_hora_salida
          ? <Text style={ styles.menu_asistencia_options_text }>{'Hora de salida: ' + asistenciaHoy.fecha_hora_salida.split(' ')[1]}</Text>
          : null
        }


        <View style={ styles.menu_asistencia}>

            {
              !loading && !asistenciaHoy?.fecha_hora_ingreso
            ? <Pressable style={ styles.menu_asistencia_options } onPress={() =>alertPostAsistenciasAPI(1)}> 
                  <Text style={ styles.menu_asistencia_options_text }>{'Marcar ingreso:'}</Text>
                  <Text style={ styles.menu_asistencia_options_button }>{'Registrar'}</Text>
              </Pressable>
              : null
            }

            {
              !loading && asistenciaHoy?.fecha_hora_ingreso && !asistenciaHoy?.fecha_hora_salida
            ? <Pressable style={ styles.menu_asistencia_options } onPress={() => alertPostAsistenciasAPI(2)}> 
                  <Text style={ styles.menu_asistencia_options_text }>{'Marcar Salida:'}</Text>
                  <Text style={ styles.menu_asistencia_options_button }>{'Registrar'}</Text>
              </Pressable>
              : null
            }
        </View>
      </View>
      <View style={styles.button_logout}>
        <LogOut navigation={navigation}></LogOut>
      </View>
    </View>
  )
} 

const styles = StyleSheet.create({
  user_container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'white', //cfcfd1
    padding:30,
  },
  user_container_options:{
    width: '100%',
  },
  name_user:{
    fontSize:30,
    textAlign:'center',
    fontWeight:500,
  },
  rol_user:{
    fontSize:20,
    textAlign:'center',
    width: '100%',
  },
  button_logout:{
    height:60,
    width: '100%',
  },
  menu_user:{
    marginVertical:10
  },
  menu_options:{
    height:60, //45
    marginVertical:5,
    width: '100%',
    borderColor: '#cfcfd1',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    textAlign:'center',
    textAlignVertical: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    alignContent:'center',

    gap:5
  },
  menu_options_text:{
    textAlignVertical: 'center',
    height:'100%'
  },
  menu_options_info:{
    backgroundColor : '#0a0a1e',
    color:'white',
    padding:5,
    textAlignVertical: 'center',
    borderRadius:8,
  },
  menu_options_alert:{
    backgroundColor : 'red',
    color:'white',
    padding:5,
    textAlignVertical: 'center',
    borderRadius:8,
  },
  menu_asistencia:{
    height:80, //45
    width: '100%',
    flexDirection: 'row',
    gap: 5,
    marginTop: 10
  },
  menu_asistencia_options:{
    flex:1,
    borderColor: '#cfcfd166',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 3,
    padding:5,
    justifyContent: 'space-evenly'
  },
  menu_asistencia_options_text:{

  },
  menu_asistencia_options_button:{
    height:30,
    backgroundColor: '#2196f3',
    textAlign:'center',
    textAlignVertical: 'center',
    color:'white'
  },
  asistencia:{
    marginTop:20,
    fontSize:20,
    fontWeight:500,
  }
});
