import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet,Image , Text, View, TextInput, Dimensions, ScrollView, Pressable, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import BannerLogin from '../atoms/BannerLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import {UserContext} from '../../src/context/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByToken, getToken } from '../../utils/loginApi';

const { width, height } = Dimensions.get('window')
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.selectionColor = 'gray';

export default function LoginScreen() {

  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [username, setUsername] = useState('tecnico001@frioteam.pe') // coordinador_operaciones@frioteam.pe - tecnico001@frioteam.pe
  const [password, setPassword] = useState('qazwsx,.-UNI')
  const [msgErrorLogin, setMsgErrorLogin] = useState('')

  const [isSession, setIsSession] = useState(false);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    getStorage();
  }, [])

  const getStorage = async () => {
    if (await AsyncStorage.getItem('sesion')) {
        setIsSession(true);
    } else {
        setIsSession(false);
    }
  }

  const signIn = async () => {
    setMsgErrorLogin('')
    try {
      if (username !== '' && password !== '' ) {

        const res = await getToken(username, password)
        if (!res.access) {
          setMsgErrorLogin(res.detail)
          return
        }

        const token = res.access
        const user = await getUserByToken(token, username)
        if ( !user.habilitado || user.rol !== 1) {
          setMsgErrorLogin('No tiene acceso a este aplicativo')
          return
        }

        const userInfo = {
          id: user.id,
          username: user.usuario.username,
          first_name: user.usuario.first_name,
          last_name: user.usuario.last_name,
          email: user.usuario.email,
          rol: user.rol,
          habilitado: user.habilitado,
          token
        }

        await AsyncStorage.setItem('sesion', JSON.stringify(userInfo));
        setMsgErrorLogin('')
        setUser(userInfo);
        setIsSession(true);
      }
  
    } catch (error) {
     console.log(error);
    }
  };

  return (
    <ScrollView  style={styles.mainContainer}>
    <View style={styles.containerSVG}>
      <BannerLogin/>
    </View>
    <View style={styles.container}>
      <View style={styles.view_logo}>
        <Image source={require('../../assets/logo-black.png')} style={styles.logo}/>
      </View>
      
      <Text style={styles.subTitle}>Inicia sesión con tu cuenta</Text>
      <TextInput 
        placeholder="Usuario"
        value={username}
        style={styles.textInput}
        onChangeText={setUsername}
      />
      <View style={styles.textInput}>
        <TextInput 
          placeholder="Contraseña"
          style={styles.inputField}
          secureTextEntry={passwordVisibility}
          value={password}
          onChangeText={setPassword}
        />
          <Pressable onPress={handlePasswordVisibility} style={styles.icon_eye}>
            <MaterialCommunityIcons name={rightIcon} size={25} color="#232323c7"/>
          </Pressable>
      </View>
      {
        msgErrorLogin !== '' ? <Text style={styles.msg_error}>{msgErrorLogin}</Text> : null
      }

      <Pressable style={styles.button} onPress={() => signIn()}>
        <Text style={styles.button_text}>{"Ingresar"}</Text>
      </Pressable>
     
      <StatusBar style="auto" />
    </View>
  </ScrollView >
  )
} 

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white', //f1f1f1
    flex: 1,
    height: height
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -140,
  },
  containerSVG: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: -180,
  },
  view_logo:{
    marginBottom: 60,
    width: '90%',
  },
  logo:{
    width: null,
    resizeMode: 'contain',
    height: 80
  },
  titulo: {
    fontSize: 80,
    color: '#34434D',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    color: 'gray',
  },
  textInput: {
    padding: 10,
    paddingStart: 30,
    width: '80%',
    height: 50,
    marginTop: 20,
    borderColor: '#cfcfd1',
    borderRadius: 30,
    borderStyle: 'solid',
    borderWidth: 3,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  inputField: {
    width: '90%',
  },
  forgotPassword: {
    fontSize: 14,
    color: 'gray',
    marginTop: 20
  },
  button: {
    marginTop: 20,
    width: '80%',
    backgroundColor : '#0a0a1e',
    height: 50,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_text: {
    color : 'white',
  },
  msg_error: {
    color : 'red',
    width: '70%',
    textAlign: 'center',
    marginTop: 20
  },
  icon_eye: {
    justifyContent: 'center',
    height: 50,
  }
});