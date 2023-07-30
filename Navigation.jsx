import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import UserScreen from './components/screens/UserScreen';
import TaskScreen from './components/screens/TaskScreen';
import ListTaskScreen from './components/screens/ListTaskScreen';
import CreateTaskScreen from './components/screens/CreateTask';
import TaskDetailScreen from './components/screens/TaskDetail';
import SolicitudScreen from './components/screens/SolicitudScreen';
import SolicitudDetailScreen from './components/screens/SolicitudDetailScreen';
import TaskOfflineScreen from './components/screens/TaskOfflineScreen';

import {UserContext} from './src/context/UserProvider';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user, newTask } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'  screenOptions={{ headerShown: false }}>
        {user ? (
          !newTask ? (
            <>
              <Stack.Screen name='Home' component={HomeScreen} />
              <Stack.Screen name='User' component={UserScreen}  options={{ headerShown: true, title: 'Perfil del usuario' }}/>
              <Stack.Screen name='Task' component={TaskScreen}  options={{ animation: 'none' }}/>
              <Stack.Screen name='ListTask' component={ListTaskScreen}  options={{ animation: 'none' }}/>
              <Stack.Screen name='CreateTask' component={CreateTaskScreen}  options={{ animation: 'none' }}/>
              <Stack.Screen name='TaskDetail' component={TaskDetailScreen}  options={{ animation: 'none' }}/>
              <Stack.Screen name='Solicitud' component={SolicitudScreen}  options={{ animation: 'none' }}/>
              <Stack.Screen name='SolicitudDetail' component={SolicitudDetailScreen}  options={{ animation: 'none' }}/>
              <Stack.Screen name='TaskOffline' component={TaskOfflineScreen}  options={{ animation: 'none' }}/>
            </>
          ) : (
            <>
              <Stack.Screen name='CreateTask' component={CreateTaskScreen}  options={{ animation: 'none' }}/>
            </>
          )
          
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen}/>
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
