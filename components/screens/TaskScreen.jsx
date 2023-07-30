import {useContext} from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, ToastAndroid } from 'react-native'
import Title from '../atoms/Title';
import FieldText from '../molecules/FieldText';
import {UserContext} from '../../src/context/UserProvider';
import Layout from '../templates/Layout'
import { closedProjectByID } from '../../utils/servicesApi';
import { formatDateType } from '../../utils/dateFormat';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskScreen({navigation}) {

  const { projectOpen, user, net, dataOffline, setDataOffline } = useContext(UserContext);

  const projectClosedOffline = dataOffline?.projectClosed || []
  console.log('projectClosedOffline', projectClosedOffline);



  const myProjectOffline = (projectClosedOffline.length>0 ? projectClosedOffline?.find(p => p?.id=== projectOpen.id) : {}) || {}
  console.log('myProjectOffline', myProjectOffline);

  const closedProject = async () =>{
    if(!myProjectOffline?.id) {
      Alert.alert('Terminar proyecto', '¿Está seguro que desea terminar este proyecto?', [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {text: 'Continuar', onPress: () => {
          okClosedProject()
        },style: 'default'
      },
      ])
    } else {
      Alert.alert('Terminar proyecto', 'Ya se ha cerrado el proyecto en modo offline', [
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ])
    }
  }

  async function okClosedProject(){
    const now = new Date()

    if ( net ){
      const res = await closedProjectByID(user.token, projectOpen.id, formatDateType(new Date(),'YYYY/MM/DD HH:MM:SS'))
    } else {

      if(!myProjectOffline?.id) projectClosedOffline.push({date: now, id:projectOpen.id}) 
      const newDataOffline = {...dataOffline, lastmodified: now, projectClosed:projectClosedOffline }
      setDataOffline(newDataOffline)
      await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
    }

    navigation.navigate('Home')

  };

  const labelTypeProject = (e) =>{
    let res = ''
    switch (e) {
      case 'en_ejecucion':
        res = 'en PROCESO'
        break
      case 'terminado':
        res = 'Finalizado'
        break
      case 'pendiente':
        res = 'NUEVO'
        break
      default:
        ''
    }
    return res
  }

  const dateProject = (e) =>{
    let res = ''
    switch (e) {
      case 'en_ejecucion':
        res = projectOpen.f_en_ejecucion.toLocaleString()
        break
      case 'terminado':
        res = projectOpen.f_terminado.toLocaleString()
        break
      case 'pendiente':
        res = projectOpen.f_enviado_tecnico.toLocaleString()
        break
      default:
        ''
    }
    return res
  }

  return (
    <Layout navigation={navigation} style={{ height:'100%'}}>
     
      <ScrollView style={styles.mainContainer} contentContainerStyle={{   minHeight:'100%', padding:10}}>
        <View style={styles.container}>
          <View>
            <Title text={projectOpen.cod_nisira}/>
            <FieldText  title={'Proyecto '+ labelTypeProject(projectOpen.tipo_proyecto)} text={formatDateType(dateProject(projectOpen.tipo_proyecto),'DD/MM/YYYY HH:MM')}/>
            <FieldText  title={'Cliente'} text={[projectOpen.cliente_principal_str, projectOpen.cliente_secundario_str]}/>
            <FieldText  title={'Descripción'} text={projectOpen.descripcion_str}/>
            <FieldText  title={'Ubicación'} text={projectOpen.direccion_str}/>
          </View>
          <View >
            <View style={styles.task_buttons}>

              { user.rol === 1 && !projectOpen.f_terminado && projectOpen.f_en_ejecucion
                ?
                <Pressable style={styles.button_closed} onPress={() => {closedProject()}}>
                    <Text style={styles.button_closed_text}>Terminar proyecto</Text> 
                </Pressable >
                : null
              }

              <Pressable  style={styles.button_tasks} onPress={() => {navigation.navigate('ListTask') }}>
                  <Text  style={styles.button_tasks_text}>Ver actividades</Text> 
              </Pressable >
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
    
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white', //f1f1f1
    flex:1,
  },
  container:{
    flex: 1,
    justifyContent: "space-between",
    height: '100%'
  },
  task_buttons:{
    height:60,
    flexDirection: 'row',
    gap:10,
  },
  button_closed:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'red',
    color: 'white',
  },

  button_closed_text:{
    color: 'white',
    fontWeight: 500,
    fontSize: 16,
  },
  button_tasks:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    borderColor: '#cfcfd1',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  button_tasks_text:{
    color: 'gray',
    fontWeight: 500,
    fontSize: 16,
  },
});