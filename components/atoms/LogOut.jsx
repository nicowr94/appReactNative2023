import {useState, useContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet,Image , Text, View, TextInput, Dimensions, ScrollView, Pressable, Alert } from 'react-native'
import {UserContext} from '../../src/context/UserProvider';

export default function LogOut({navigation}) {
    const [isSession, setIsSession] = useState(false);
    const { setUser } = useContext(UserContext);
    const logOutSession = async () => {
        const userInfo = {}
        await AsyncStorage.setItem('sesion', JSON.stringify(''));
        setUser(undefined);
        setIsSession(false);
    }
    return (
        <View style={styles.content_logout}>
            <Pressable style={styles.logout_button} onPress={() => logOutSession()}>
                <Text style={styles.button_text}>{"Cerrar sesión"}</Text>
            </Pressable>
        </View>
        )
}


const styles = StyleSheet.create({
    content_logout:{
        flex:1,
    },
    logout_button: {
        backgroundColor: 'red', //f1f1f1
        flex:1,
        

    },
    button_text:{
        textAlign:'center',
        textAlignVertical: 'center',
        fontSize:18,
        padding:10,
        color:'white',
        flex:1,

    }
  });