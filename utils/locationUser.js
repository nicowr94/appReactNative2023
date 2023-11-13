import { useContext, useEffect } from 'react';
import { UserContext } from '../src/context/UserProvider';
import * as Location from 'expo-location';

const locationUser = ({permisosSolicitados}) => {
  const { geo, setGeo } = useContext(UserContext);

  const valueDefault = () => {
    const geoDefault = { oldData: geo, stringData: 'null' };
    setGeo(geoDefault);
  }
  const getLocation = async () => {
    try {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Please grant location permissions");
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        currentLocation.stringData = currentLocation.coords.latitude + ", " + currentLocation.coords.longitude;
        currentLocation.oldData = currentLocation;
        setGeo(currentLocation);
    } catch (error) {
        // console.error("Error getting location:", error.message);
        // En caso de error, devolver un objeto vacío
        valueDefault()
    }
};
if (!permisosSolicitados ) getLocation()

};

export default locationUser;

