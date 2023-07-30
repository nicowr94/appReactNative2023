import {useState, useContext, useEffect, useRef} from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import Layout from '../templates/Layout'
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListCard from '../molecules/ListCard';
import SubTitle from '../atoms/SubTitle';
import {UserContext} from '../../src/context/UserProvider';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen ({navigation}) {
  // <Pressable onPress={() => navigation.navigate('Task')}><Text >{"Task"}</Text></Pressable>
  const { user, net,setDataOffline } = useContext(UserContext);
  const pickerRef = useRef();
  const isFocused = useIsFocused();
  const options = [
    { label: "Proyectos NUEVOS", value: 'pendiente' }, // nuevos proyectos
    { label: "Proyectos EN PROCESO", value: 'en_ejecucion' },
    { label: "Proyectos FINALIZADOS", value: 'terminado' },

  ]
  const [ list, setList] = useState(options[0].value)

  useEffect(() => {
    setList(options[0].value)
}, [isFocused])
  const icon_picker = () =>{
    return <MaterialCommunityIcons name={'chevron-down'} size={35} color="#232323c7" style={styles.button_picker}/>
  }

  return (
    <Layout navigation={navigation}  style={styles.layout} btn_back={false}>
      <View style={styles.container}>
        <View style={styles.container_picker}>
          <RNPickerSelect
              onValueChange={(value) => setList(value)}
              placeholder={{}}
              items={options}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => {return icon_picker()}}
              value={list}
          />
        </View>
        <SubTitle content={'Lista de '+ options.find(a => a.value === list ).label + ':'} fontSize={16} paddingBottom={10}/>
        <ListCard elements={list} navigation={navigation} user={user}/>
      </View>
    </Layout>
    
  )
}

const styles = StyleSheet.create({
  layout:{
    height:'100%'
  },
  container: {
      backgroundColor: 'transparent',
      height:'100%'
  },
  container_picker:{
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical:10,
    backgroundColor: 'white',
    minHeight:40,
    justifyContent:'center'
  },
  select_icon:{
    borderColor: 'gray',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 0,
    marginVertical: 21.5
  },
  button_picker:{
    flex:1,
    height:30,
    marginVertical:8,
    backgroundColor: 'white',

  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      color: 'black',
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      height:50
  },
  inputAndroid: {
      fontSize: 16,
      color: 'black',
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      height:50
  },
});