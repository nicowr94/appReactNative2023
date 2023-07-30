import {useContext} from 'react'
import { StyleSheet,Image , Text, View, Pressable } from 'react-native'
import {UserContext} from '../../src/context/UserProvider';


export default function User({navigation}) {
  const { user, net } = useContext(UserContext);
  return (
    <View >
      
        <Pressable  onPress={() => {navigation.navigate('User') }} style={styles.user_container}>
            <View style={styles.user_container_info}>
                <Text style={styles.user_container_info_name} numberOfLines={1} >{user.first_name}</Text>
                <Text style={styles.user_container_info_role} numberOfLines={1} >{user.rol === 1 ? "Tecnico" : "Coordinador"}</Text>
            </View>
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
      justifyContent: "space-between",
      gap:5,
      width:200,
  },
  user_container_info:{
    justifyContent: "center",
    alignSelf: 'flex-start',
    width: 130,
    height: '100%',
    margin:0,
  },
  user_container_info_name:{
    textAlign:'right',
    color:'white',
    fontWeight: 600
  },
  user_container_info_role:{
    textAlign:'right',
    color:'#f1f1f1',
    fontWeight: 300
  },
  user_img_online:{
    marginRight: 10,
    width: null,
    borderColor: '#33c032',
    borderRadius:200,
    borderStyle: 'solid',
    borderWidth: 3,
  },
  user_img_offline:{
    marginRight: 10,
    width: null,
    borderColor: 'red',
    borderRadius:200,
    borderStyle: 'solid',
    borderWidth: 3,
  },
  user_container_img:{
    resizeMode: 'contain',
    height: 50,
    width: 50,
},
});
