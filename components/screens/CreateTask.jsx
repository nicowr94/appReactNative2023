import { useContext, useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert  } from 'react-native'
import Title from '../atoms/Title';
import FieldText from '../molecules/FieldText';
import Timer from '../atoms/Timer';
import Layout from '../templates/Layout'
import SubTitle from '../atoms/SubTitle';
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getActividadesLabor, getActivitiesByProjectId, postCreateActivitiesByCotizacion, getSites } from '../../utils/servicesApi';
import locationUser from '../../utils/locationUser';

import {UserContext} from '../../src/context/UserProvider';

export default function CreateTask({navigation}) {
  console.log('****************************************************')

    const { user, newTask, projectOpen, setNewTask, net, setNet, dataOffline, setDataOffline, geo } = useContext(UserContext);
    const [permisosSolicitados, setPermisosSolicitados] = useState(false);
    const ubicacion = locationUser({permisosSolicitados})

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
    const pickerRef1 = useRef();
    const pickerRef2 = useRef();
    const pickerRef3 = useRef();
    // console.log('---------------', net);

    let listActLAbAPIDefault = [
      { label: "", value: 0, key: 1, tipo_labores :[{ label: "", value: 1, key: 0}] },
      // { label: "Seleccione el tipo de actividad", value: 0, key: 1, tipo_labores :[{ label: "Seleccione el tipo de labor", value: 1, key: 0}] },
    ]

    let listUbicacionDefault = [
      { label: "Sin ubicación", value: 0, key: 1, default: true },
      // { label: "Seleccione el tipo de actividad", value: 0, key: 1, tipo_labores :[{ label: "Seleccione el tipo de labor", value: 1, key: 0}] },
    ]

    const parceItemsSelect = (data) =>{
      let dateParce
      try {
        if (data.length > 0) {
          console.log(' map')
          dateParce = data.map( (item) =>{
            if (item.es_activo){
              return {
                label: item.nombre,
                value: item.nombre,
                key: item.id
              }
            }
            
          })
        } else{
          dateParce = listUbicacionDefault
        }
      } catch (error) {
        console.log(error)
        // setUbiDefault(true)
        dateParce = listUbicacionDefault
      }
      return dateParce
    }

    const parceItemsSelectMultiple = (data) =>{
      const dateParce = data.map( (act) =>{
        const labores = act.tipo_labores.map( (lab) =>{
          return {
            label: lab.nombre,
            value: lab.nombre,
            key: lab.id
          }
        })
        return {
          label: act.nombre,
          value: act.nombre,
          key: act.id,
          tipo_labores: labores
        }
      }
      )

      
      return dateParce
    }

    const [listActLAbAPI, setListActLAbAPI] = useState(listActLAbAPIDefault); // Lista de actividades y labores obtenidas del API
    const [listUbicaciones, setListUbicaciones] = useState(listUbicacionDefault); // Lista de ubicaciones del api

    async function getElements(){
      let res = {}
      let ubicaciones = {}
      const now = new Date ()

      if( net ) {

        res = await getActividadesLabor(user.token)
        res = parceItemsSelectMultiple(res)

        let valueDefault = false
        ubicaciones = await getSites(user.token)
        if (ubicaciones.length === 0 ) valueDefault = true
        console.log('getSites', ubicaciones)
        ubicaciones = parceItemsSelect(ubicaciones)
        console.log('--------------------------- ubicaciones', ubicaciones);

        if (!valueDefault) {
          console.log('save ')
          const newDataOffline = {...dataOffline, lastmodified: now, actLab: res, ubicaciones }
          setDataOffline(newDataOffline)
          await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
        }
      } else{

        res = dataOffline?.actLab ? dataOffline?.actLab : listActLAbAPIDefault
        ubicaciones = dataOffline?.ubicaciones ? dataOffline?.ubicaciones : listUbicacionDefault
      }

      listActLAbAPIDefault = res
      setListActLAbAPI(res)
      setListUbicaciones(ubicaciones)
      listUbicacionDefault = ubicaciones
    };
  
    useEffect(() => {
      getElements()
    }, [])

    useEffect(() => {
      setActSelect(listActLAbAPI[0]?.value)
      setlabSelect(listActLAbAPI[0]?.tipo_labores[0]?.value)
    }, [listActLAbAPI])


    const [ actSelect, setActSelect] = useState( listActLAbAPI[0]?.value) // actividad seleccionada
    const [ labSelect, setlabSelect] = useState(listActLAbAPI[0]?.tipo_labores[0]?.value) // labor seleccionada
    const [ ubiSelect, setUbiSelect] = useState(listUbicacionDefault[0]?.value) // Ubiación seleccionada
    const [ labSelectNumber, setlabSelectNumber] = useState(listActLAbAPI[0]?.tipo_labores[0]?.key) // id labor seleccionada
    const [ labOptions, setLabOptions] = useState(listActLAbAPI[0]?.tipo_labores) // Lista de labores en el select
    const [ labelAct, setLabelAct] = useState(listActLAbAPI[0]?.value) // Lista de 
    const [ labelLab, setLabelLab] = useState(listActLAbAPI[0]?.tipo_labores[0]?.value)

    const [ comment, setComment] = useState(newTask?.comment)
    const [ startDate, setStartDate] = useState(null)
    const [ endDate, setEndDate] = useState(null)

    const validarPosition = () => {
      console.log('validarPosition')
      const title = 'Comenzar actividad'
      const desc = 'Es necesario activar el GPS del dispositivo'
        Alert.alert(title, desc, [
          {text: 'Ok', onPress: () => {
          },style: 'default'
        },
        ])
    }

    const createTaskInContext= async () => {
      let position = geo?.stringData || ''
      console.log('position', position)
      if (position === 'null' || position === null) return validarPosition()
      const get_ids = net ? (await getActivitiesByProjectId(user.token,user.id, projectOpen.id)).actividades.sort(function(a,b){return b.id - a.id;})[0]?.id || 0 : 0
      const new_id = ("000"+(get_ids + 1)).slice(-3)

      const foundAct = listActLAbAPI.find(a => a?.value === actSelect)
      const tipo_labor_number = foundAct.tipo_labores?.find(a => a?.label === labSelect)?.key

      const ubicationNumber = listUbicaciones.find(a => a?.value === ubiSelect).key

      const init_start = new Date()
      setStartDate(init_start)
      const myTask = {
        start_date_str: init_start.toLocaleString(),
        start_date: init_start,
        tipo_actividad: actSelect,
        tipo_labor: labSelect,
        tipo_labor_number: tipo_labor_number,
        comment: '',
        new_id: new_id,
        project_name: projectOpen.cod_nisira,
        project_id: projectOpen.id,
        ubicacion: ubicationNumber,
        ubicacion_string: ubiSelect,
        lat_long_inicio: position
      }
      setComment('')
      await AsyncStorage.setItem('newTask', JSON.stringify(myTask));
      setNewTask(myTask);
    }

    const updateComment = async (text) => {
        setComment(text)
        const myTask2 = {
          start_date_str: newTask.start_date_str,
          start_date: newTask.startDate,
          tipo_actividad: newTask.tipo_actividad,
          tipo_labor: newTask.tipo_labor,
          tipo_labor_number: newTask.tipo_labor_number,
          comment: text,
          new_id:newTask. new_id,
          project_name: newTask.project_name,
          project_id: newTask.project_id,
          lat_long_inicio: newTask.lat_long_inicio
        }

        const myTask = {
          ...newTask, comment: text
        }
        await AsyncStorage.setItem('newTask', JSON.stringify(myTask));
        setNewTask(myTask);
    }


    const closedTaskInContext= async () => {
      const end_task = new Date()
      let position = geo?.stringData || ''
      if (position === 'null') position = newTask.lat_long_inicio
      setEndDate(end_task)

      // Enviar actividades
      const fecha_inicio = new Date(newTask.start_date).getFullYear() + "-" + new Date(newTask.start_date).getMonth() + "-" + new Date(newTask.start_date).getDate()
      const fecha_fin= end_task.getFullYear() + "-" + end_task.getMonth() + "-" + end_task.getDate()
      const h_inicio = new Date(newTask.start_date).getHours() + ":" + new Date(newTask.start_date).getMinutes() + ":" + new Date(newTask.start_date).getSeconds()
      const h_termino = end_task.getHours() + ":" + end_task.getMinutes() + ":" + end_task.getSeconds()
      const activities = {
        "cotizacion": newTask.project_id,
        "tipo_labor": newTask.tipo_labor_number,
        "tecnico": user.id, // ID del técnico que está trabajando (*requerido)
        // "fecha": fecha, // "2023-03-07", // FECHA INTERNA DEL SISTEMA (*requerido)
        // "h_inicio": h_inicio, // Hora de inicio de la actividad (*requerido)
        // "h_termino": h_termino, // Hora de término de la actividad
        "fecha_hora_inicio": fecha_inicio + " " + h_inicio , 
        "fecha_hora_termino": fecha_inicio + " " + h_termino, 
        "comentario": comment,
        // Opcional, comentario sobre la actividad
        "es_activo": true, // (*requerido) siempre como activo,
        "ubicacion": newTask.ubicacion,
        "lat_long_inicio": newTask.lat_long_inicio,
        "lat_long_termino": position,
      }
      
      if( net ) await postCreateActivitiesByCotizacion(user.token, [activities])
      else {
        const listTaskOffline = dataOffline.tasksOffline ? dataOffline.tasksOffline : []
        listTaskOffline.push(activities)
        const newDataOffline = {...dataOffline, lastmodified: end_task, tasksOffline: listTaskOffline }
        setDataOffline(newDataOffline)
        await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));
      }
      await AsyncStorage.setItem('newTask', JSON.stringify(''));
      setNewTask(undefined);
      navigation.navigate('ListTask')
    }

    useEffect(() => {
      const foundAct = listActLAbAPI.find(a => a?.value === actSelect)
      if(!foundAct?.tipo_labores[0]?.value) return
      setlabSelect(foundAct.tipo_labores[0]?.value)
      const found = foundAct.tipo_labores;
      setLabOptions(found ? found : null )

    }, [actSelect]);

    useEffect(() => {
     
    }, [labOptions, labSelect]);

    const icon_picker = () =>{
      return <MaterialCommunityIcons name={'chevron-down'} size={35} color="#232323c7" style={styles.button_picker}/>
    }

    
  const confrimClosedTask = async () =>{
    Alert.alert('Terminar actividad', '¿Está seguro que desea terminar esta actividad?', [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {text: 'Continuar', onPress: () => {
        closedTaskInContext()
      },style: 'default'
    },
    ])
  }

    return (
      <Layout navigation={navigation} style={styles.layoutContainer} >

        {newTask ? (
          <ScrollView style={styles.mainContainer} contentContainerStyle={{   minHeight:'100%', padding:10}}>
            <View style={styles.container}>
              <View>
                <Title text={newTask.project_name} count={newTask?.new_id}/>
                <FieldText  title={'Tipo de actividades'} text={ newTask?.tipo_actividad}/>
                <FieldText  title={'Tipo de labores'} text={newTask?.tipo_labor}/>
                <FieldText  title={'Ubicación'} text={newTask?.ubicacion_string}/>
                <FieldText  title={'Fecha de inicio:'} text={newTask?.start_date_str} row={true}/>
                <Timer date_start = {newTask?.start_date} />
                <SubTitle content='Comentarios (opcional)' />
                <View style={styles.container_comment}>
                  <TextInput
                    editable
                    multiline = {true}
                    numberOfLines={2}
                    maxLength={40}
                    onChangeText={text => updateComment(text)}
                    value={comment}
                    style={{padding: 10}}
                    maxLength = {255}
                  />
                </View>

              </View>
              <View >
                <View style={styles.task_buttons}>
                  <Pressable style={styles.button_closed} onPress={() => confrimClosedTask()}>
                      <Text style={styles.button_closed_text}>Terminar actividad</Text> 
                  </Pressable >
                </View>
              </View>
            </View>
        </ScrollView>
        ) : (
          <View style={styles.mainContainer_padding}>
              <View style={styles.container}>
                <View>
                  <Title text={projectOpen.cod_nisira}/>
                  <SubTitle content={'Tipo de actividades '} fontSize={16}/>
                  <View style={styles.container_picker}>
                    <RNPickerSelect
                        ref={pickerRef1}
                        onValueChange={(value) => setActSelect(value)}
                        useNativeAndroidPickerStyle={false}
                        items={listActLAbAPI}
                        style={pickerSelectStyles}
                        placeholder={{}}
                        value={actSelect}
                        Icon={() => {return icon_picker()}}
                        textInputProps={{multiline: true}}

                    />
                  </View>
                  <SubTitle content={'Lista de labores '} fontSize={16}/>
                  <View style={styles.container_picker}>
                    <RNPickerSelect
                        ref={pickerRef2}
                        onValueChange={(value) => setlabSelect(value)}
                        useNativeAndroidPickerStyle={false}
                        items={labOptions}
                        style={pickerSelectStyles}
                        placeholder={{}}
                        value={labSelect}
                        Icon={() => {return icon_picker()}}
                        textInputProps={{multiline: true}}
                    />
                  </View>
                  <SubTitle content={'Ubicación '} fontSize={16}/>
                  <View style={styles.container_picker}>
                    <RNPickerSelect
                        ref={pickerRef3}
                        onValueChange={(value) => setUbiSelect(value)}
                        useNativeAndroidPickerStyle={false}
                        items={listUbicaciones}
                        style={pickerSelectStyles}
                        placeholder={{}}
                        value={ubiSelect}
                        Icon={() => {return icon_picker()}}
                        textInputProps={{multiline: true}}

                    />
                  </View>
                </View>
                <View >
                  <View style={styles.task_buttons}>

                  
                    <Pressable style={styles.button_start} onPress={() => createTaskInContext()}>
                        <Text style={styles.button_closed_text}>Comenzar actividad</Text> 
                    </Pressable >
                    
                  </View>
                </View>
              </View>
          </View>
        ) }
      </Layout>
    )
}

const styles = StyleSheet.create({
  layoutContainer:{
      // height:'100%',
  },
  mainContainer_padding: {
    backgroundColor: 'white', //f1f1f1
    flex:1,
    padding: 10
  },
  mainContainer: {
    backgroundColor: 'white', //f1f1f1
    flex:1,
  },
  container:{
    flex: 1,
    justifyContent: "space-between",
    // height: '100%'
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
  button_start:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#3ec6ac',
    color: 'white',
  },
  button_picker:{
    flex:1,
    height:30,
    marginVertical:8,
    backgroundColor: 'white',

  },
  button_tasks_text:{
    color: 'gray',
    fontWeight: 500,
    fontSize: 16,
  },
  container_picker:{
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical:10,
    backgroundColor: 'white',
    minHeight:40,
    justifyContent:'center'
  },
  container_comment:{
    borderColor: '#cfcfd1',
    borderStyle: 'solid',
    borderWidth: 3,
    marginTop: 10,
    marginBottom: 20,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      color: 'black',
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    color: 'black',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    height:50,
    textAlign: 'left'
  }
});