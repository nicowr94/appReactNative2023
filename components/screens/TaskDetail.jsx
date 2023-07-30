
import { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput  } from 'react-native'
import Title from '../atoms/Title';
import FieldText from '../molecules/FieldText';
import Timer from '../atoms/Timer';
import Layout from '../templates/Layout'
import SubTitle from '../atoms/SubTitle';
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getActividadesLabor, getActivitiesByProjectId, postCreateActivitiesByCotizacion } from '../../utils/servicesApi';

import {UserContext} from '../../src/context/UserProvider';
import { formatDateType } from '../../utils/dateFormat';

export default function TaskDetail({navigation}) {

    const { projectOpen, actOpen } = useContext(UserContext);
    const saveProject =  {
        "actualizado": "2023-04-09T21:49:17.733650",
        "comentario": "Ha sido una actividad genial y fácil",
        "es_activo": true,
        "estado_str": "Cambio aprobado",
        "fecha": "2023-03-07",
        "h_inicio": "11:00:00",
        "h_termino": "12:45:00",
        "id": 2,
        "tipo_labor": {"descripcion": "", "es_activo": true, "id": 6, "nombre": "ARMADO DE TABLEROS CAREL"}
      }
      console.log(actOpen);
    return (
      <Layout navigation={navigation} style={styles.layoutContainer} >
          {actOpen ? (
               <ScrollView style={styles.mainContainer} contentContainerStyle={{   minHeight:'100%', padding:10}}>
                    <View style={styles.container}>
                        <View>
                            <Title text={projectOpen.cod_nisira} count={ ("000"+actOpen?.id).slice(-3)}/>
                            <FieldText  title={'Tipo de actividades'} text={ actOpen?.tipo_actividad_str}/>
                            <FieldText  title={'Tipo de labores'} text={actOpen?.tipo_labor.nombre}/>
                            <FieldText  title={'Ubicación'} text={actOpen?.ubicacion_str}/>
                            <FieldText  title={'Fecha de inicio:'} text={formatDateType(actOpen?.fecha + " " + actOpen?.h_inicio, 'DD/MM/YYYY HH:MM:SS') } />
                            <FieldText  title={'Fecha de fin:'} text={formatDateType(actOpen?.fecha + " " + actOpen?.h_termino, 'DD/MM/YYYY HH:MM:SS') } />
                            <Timer date_start = {new Date (actOpen?.fecha + " " + actOpen?.h_inicio)} date_end = {new Date (actOpen?.fecha + " " + actOpen?.h_termino)} activated={false}/>
                            <FieldText  title={'Comentario:'} text={actOpen?.comentario ? actOpen.comentario : '---'} />
                            
                        </View>
                    </View>
            </ScrollView>
          ) : null}
         
        
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
      backgroundColor: 'white',
  }
});