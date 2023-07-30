import {useState, useEffect, useContext} from 'react'
import { StyleSheet,SafeAreaView, Pressable , Text, View, TextInput, FlatList } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getActivitiesByProjectId } from '../../utils/servicesApi';
import {UserContext} from '../../src/context/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListActivities({navigation}) {

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const { user, projectOpen, setActOpen } = useContext(UserContext);
  
    useEffect( () => {
      setFilteredDataSource({});
      setMasterDataSource({});
      const getElements = async () =>{
        const res = (await getActivitiesByProjectId(user.token,user.id, projectOpen.id)).actividades.sort(function(a,b){return b.id - a.id;})
        setFilteredDataSource(res);
        setMasterDataSource(res);
     }
     getElements()
    }, []);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const itemData = item.id
              ? (item.id+'').toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
    };

    const ItemView = ({ item }) => {
      return (
        // Flat List Item
        <View style={styles.item_container}>
            <View style={styles.itemStyle}>
              <Text style={styles.itemStyle_text} onPress={() => {}} >
                {/* {projectOpen.cod_nisira}
                {'-'} */}
                Actividad: {item.id}
              </Text>
              <Pressable style={styles.itemStyle_icon} onPress={ async() => {
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
                await AsyncStorage.setItem('actOpen', JSON.stringify(item));
                setActOpen(item)
                navigation.navigate('TaskDetail') 
              }} >
                <MaterialCommunityIcons name={'chevron-right'} size={30} color="#232323c7"/>
              </Pressable>
            </View>
            <View style={styles.itemStyle_break}>
              <View style={{  height: 1, width:'95%',backgroundColor:'#cfcfd1'}}></View>
            </View>
        </View>
      );
    };
    
    const getItem = (item) => {
      // Function for click on an item
      // alert('Id : ' + item.id + ' Title : ' + item.title);
    };
    
    return (

      <>{
        false ? 
          (<View>
            <Text>
              Cargando
            </Text>
            
            </View>) 
          : (
            <SafeAreaView style={styles.container}>

                {
                    (masterDataSource?.length > 0) ?   
                    <>
                        <TextInput
                          style={styles.textInputStyle}
                          onChangeText={(text) => searchFilterFunction(text)}
                          value={search}
                          underlineColorAndroid="transparent"
                          placeholder={'Ingresa el número de la actividad'} 
                        />
          
                        <FlatList
                            horizontal={false}
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => <ItemView item={item} />}
                            
                        />
                    </>
                    :
                    <Text style={styles.none_text} >
                      Sin elementos
                    </Text>
                }
            </SafeAreaView>
        )
      }
    </>

    )
}

const styles = StyleSheet.create({
    container: {
      borderColor: '#cfcfd1',
      borderStyle: 'solid',
      borderWidth: 1,
      flex:1
    },
    item_container:{
      flex:1,
      maxWidth: '100%',
      justifyContent: 'center',
    },
    itemStyle: {
      padding: 10,
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemStyle_text:{
      maxWidth: '90%',
      flex:1,
    },
    itemStyle_icon:{
      flex:1,
      maxWidth: '8%',
    },
    itemStyle_break:{
      width: '100%',
      alignItems: "center",

    },
    textInputStyle: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 20,
      margin: 5,
      borderColor: '#3aabef',
      backgroundColor: '#FFFFFF',
    },
    none_text:{
      padding:20,
      textAlign: 'center'
    }
});