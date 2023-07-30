import React, {useEffect, createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

const UserProvider = ({children}) => {
  const [net, setNet] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [newTask, setNewTask] = useState(undefined);
  const [taskDone, setTaskDone] = useState(undefined); // Tareas terminadas pero no subidas a la base de datos
  const [projectOpen, setProjectOpen] = useState(undefined); // Projecto abierto
  const [actOpen, setActOpen] = useState(undefined); // Actividad abierto
  const [dataOffline, setDataOffline] = useState({}); // Actividades guardadas localmente
  const [asistencias, setAsistencias] = useState({}); // Información de las asistencias del usuario

  const data_offline = {
    lastmodified: new Date(),
    listProjects: {
      nuevos: [],
      en_proceso: [],
      finalizados: []
    },
    projectClosed:[],
    asistenciasOffline: [],
  }

  useEffect(() => {
    const validStorage = async () => {
      try {
        const mySesion = await AsyncStorage.getItem('sesion');
        const myTaskNew = await AsyncStorage.getItem('newTask');
        const myTasksDone= await AsyncStorage.getItem('taskDone');
        const myProjectOpen= await AsyncStorage.getItem('projectOpen');
        const myActOpen= await AsyncStorage.getItem('actOpen');
        const myDataOffline= await AsyncStorage.getItem('dataOffline');
        const myAsistencias= await AsyncStorage.getItem('asistencias');
        setUser(JSON.parse(mySesion));
        setNewTask(JSON.parse(myTaskNew));
        setTaskDone(JSON.parse(myTasksDone));
        setProjectOpen(JSON.parse(myProjectOpen));
        setActOpen(JSON.parse(myActOpen));
        setDataOffline(JSON.parse(myDataOffline));
        setAsistencias(JSON.parse(myAsistencias));
      } catch (error) {
        console.log(`ERROR: ${error.message}`)
      }
    }

    validStorage();
  }, []);
  
  return (
    <UserContext.Provider value={{net, setNet, user, setUser, newTask, setNewTask, projectOpen, setProjectOpen, actOpen, setActOpen, dataOffline, setDataOffline, asistencias, setAsistencias}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;