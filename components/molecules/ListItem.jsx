import {useState, useEffect, useContext} from 'react'
import { StyleSheet,SafeAreaView, Pressable , Text, View, TextInput, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getServicesByState, getServicesById } from '../../utils/servicesApi';
import {UserContext} from '../../src/context/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemSolicitud from '../atoms/ItemSolicitud';
import ItemTaskOffline from '../atoms/ItemTaskOffline';

export default function ListItem({elements, navigation, filter = true}) {

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState(elements);
    const [masterDataSource, setMasterDataSource] = useState(elements);
    const { setProjectOpen } = useContext(UserContext);

    useEffect(() => {
      const newElement = filter ? elements.map((item) => ({...item, label:item?.cotizacion?.cod_nisira + "-" + item?.id})) : elements
      setFilteredDataSource(newElement)
      setMasterDataSource(newElement)
  }, [elements])

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const itemData = item.label
              ? item.label.toUpperCase()
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
    
    return (

      <>{
            <SafeAreaView style={styles.container}>
                {
                    (masterDataSource && masterDataSource?.length > 0) ?   
                    <>
                        { filter ? 
                          <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(text) => {if(masterDataSource?.length > 0) searchFilterFunction(text)}}
                            value={search}
                            underlineColorAndroid="transparent"
                            placeholder={'Ingresa el código'} 
                        />
                        : null
                        }
                        <FlatList
                            horizontal={false}
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => {
                              if(filter) return <ItemSolicitud item={item} navigation = {navigation}/>
                              else return <ItemTaskOffline item={item} index={index}/>
                            }}
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