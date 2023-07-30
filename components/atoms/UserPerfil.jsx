import {useContext} from 'react'
import { StyleSheet,Image , Text, View, Pressable } from 'react-native'
import {UserContext} from '../../src/context/UserProvider';


export default function UserPerfil({navigation}) {
  const { net } = useContext(UserContext);
  return (
    <View >
      
        <Pressable style={styles.user_container}>
            <View style={net ? styles.user_img_online : styles.user_img_offline }>
              <Image source={require('../../assets/user.png')} style={styles.user_container_img}/>
            </View>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  user_container: {
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "center",
      gap:5,
      width:'100%',
      marginVertical:20
  },
  user_img_online:{
    width: null,
    borderColor: '#33c032',
    borderRadius:200,
    borderStyle: 'solid',
    borderWidth: 10,
  },
  user_img_offline:{
    width: null,
    borderColor: 'red',
    borderRadius:200,
    borderStyle: 'solid',
    borderWidth: 10,
  },
  user_container_img:{
    resizeMode: 'contain',
    height: 140,
    width: 140,
},
});
