import {useState, useEffect, useContext} from 'react'
import { StyleSheet,SafeAreaView, Pressable , Text, View, TextInput, FlatList } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getServicesByState, getServicesById } from '../../utils/servicesApi';
import {UserContext} from '../../src/context/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListCard({elements,user, navigation}) {

    const [search, setSearch] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const { setProjectOpen, net, dataOffline, setDataOffline } = useContext(UserContext);

    
    useEffect( () => {
      textPlaceholder()
      const getElements = async () =>{
        const now = new Date ()
        let res = null
        if (net) {
          res = await getServicesByState(user.token, elements,user.id)
          let data = {...dataOffline?.listProjects}
          switch (elements) {
            case 'en_ejecucion':
              data = {...data, en_ejecucion: res.results }
              break
            case 'terminado':
              data = {...data, terminado: res.results }
              break
            case 'pendiente':
              data = {...data, pendiente: res.results }
              break
            default:
              ''
          }
          const newDataOffline = {...dataOffline, lastmodified: now, listProjects: data }
          setDataOffline(newDataOffline)
          await AsyncStorage.setItem('dataOffline', JSON.stringify(newDataOffline));

        } else{
          let data = {}
          switch (elements) {
            case 'en_ejecucion':
              data = dataOffline?.listProjects?.en_ejecucion
              break
            case 'terminado':
              data = dataOffline?.listProjects?.terminado
              break
            case 'pendiente':
              data = dataOffline?.listProjects?.pendiente
              break
            default:
              ''
          }

          res = {results: data}

        }
        setFilteredDataSource(res?.results);
        setMasterDataSource(res?.results);

     }
     getElements()
    }, [elements]);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const itemData = item.cod_nisira
              ? item.cod_nisira.toUpperCase()
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

    const textPlaceholder = () => {
      let typeObj = ''
      switch (elements) {
        case 'en_ejecucion':
          typeObj = 'del proyecto'
          break
        case 'terminado':
          typeObj = 'del proyecto'
          break
        case 'pendiente':
          typeObj = 'la actividad'
          break
        default:
          ''
      }
      setPlaceholder('Ingresa el código '+ typeObj)
    }

    const ItemView = ({ item }) => {
      return (
        // Flat List Item
        <View style={styles.item_container}>
          <View style={styles.itemStyle}>
            <Text style={styles.itemStyle_text} onPress={() => getItem(item)}>
              {item.cod_nisira}
            </Text>
            <Pressable style={styles.itemStyle_icon}  onPress={ async() => {
                let saveProject = {}
                if( net ) {
                  const project = await getServicesById(user.token, item.id)
                  saveProject =  project.results[0]
                } else{
                  saveProject = item
                }

                await AsyncStorage.setItem('projectOpen', JSON.stringify(saveProject));
                setProjectOpen({...saveProject, tipo_proyecto:elements})
                // const getProject = await AsyncStorage.getItem('projectOpen');
                navigation.navigate('Task') 
              }}>
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
      // alert('Id : ' + item.id + ' Title : ' + item.cod_nisira);
    };
    
    return (

      <>{
            <SafeAreaView style={styles.container}>
                {
                    (masterDataSource?.length > 0) ?   
                    <>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(text) => {if(masterDataSource?.length > 0) searchFilterFunction(text)}}
                            value={search}
                            underlineColorAndroid="transparent"
                            placeholder={placeholder} 
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
      }
    </>


    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderColor: '#cfcfd1',
      borderStyle: 'solid',
      borderWidth: 1,
      flex:1,

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