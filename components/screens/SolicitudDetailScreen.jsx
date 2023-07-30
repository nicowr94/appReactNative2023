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
import TextContent from '../atoms/TextContent';
import {UserContext} from '../../src/context/UserProvider';
import { formatDateType } from '../../utils/dateFormat';

export default function SolicitudDetailScreen({route, navigation}) {
    const { solicitud } = route.params;
    const { projectOpen, actOpen } = useContext(UserContext);

    return (
      <Layout navigation={navigation} style={styles.layoutContainer} >
          {actOpen ? (
               <ScrollView style={styles.mainContainer} contentContainerStyle={{   minHeight:'100%', padding:10}}>
                    <View style={styles.container}>
                        <View>
                            <Title text={solicitud.cotizacion.cod_nisira} count={ ("000"+solicitud?.id).slice(-3)}/>
                            <FieldText  title={'Cliente'} text={[solicitud.cotizacion.cliente_principal_str, solicitud.cotizacion.cliente_secundario_str]}/>
                            <FieldText  title={'Descripción'} text={solicitud.cotizacion.descripcion_str}/>
                            <FieldText  title={'Tipo de labores'} text={solicitud?.tipo_labor.nombre}/>
                            <FieldText  title={'Estado del cambio'} text={solicitud?.estado_str}/>

                            { solicitud.fecha_nuevo  ?
                                <>
                                    <FieldText  title={'Fecha'} text={formatDateType(solicitud?.fecha, 'DD/MM/YYYY') }/>
                                    <FieldText  title={'Nueva fecha'} text={formatDateType(solicitud?.fecha_nuevo, 'DD/MM/YYYY')}/>
                                </>
                             : null
                            }

                            { solicitud.h_inicio_nuevo  ?
                                <>
                                    <FieldText  title={'Hora de inicio'} text={solicitud?.h_inicio}/>
                                    <FieldText  title={'Nueva hora de inicio'} text={solicitud?.h_inicio_nuevo}/>
                                </>
                             : null
                            }

                            { solicitud.h_termino_nuevo  ?
                                <>
                                    <FieldText  title={'Hora de termino'} text={solicitud?.h_termino}/>
                                    <FieldText  title={'Nueva hora de termino'} text={solicitud?.h_termino_nuevo}/>
                                </>
                             : null
                            }

                            { solicitud.comentario_nuevo  ?
                                <>
                                    <FieldText  title={'Comentarios'} text={solicitud?.comentario}/>
                                    <FieldText  title={'Nuevo comentario'} text={solicitud?.comentario_nuevo}/>
                                </>
                             : null
                            }

                            <FieldText  title={'Razones de cambio'} text={solicitud?.razones_cambio}/>
                            <FieldText  title={'Actualización'} text={formatDateType(solicitud?.actualizado, 'DD/MM/YYYY HH:MM:SS')}/>
                            
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