import {useState, useEffect} from 'react'
import { Text, StyleSheet, View } from 'react-native'
import useTimer from '../../hooks/useTimer'

export default function Timer({date_start, date_end = undefined, mini = false, activated = true}) {
    const [ time , setTime] = useState( { days : 0, time : '00:00:00'})
    useEffect(() => {

        const interval = setInterval(() => {
            const now = date_end ? date_end : new Date()
            // const res = dias > 0 ? (dias + " dias "+horas +":"+minutos +":"+segundos) : (horas +":"+minutos +":"+segundos)
            const timerHook = useTimer({start_date:date_start,end_date:now})
            // const res = timerHook.days > 0 ? (timerHook.days + " dias "+ timerHook.time) : (timerHook.time)
            setTime(timerHook)
        }, 1000);

        if (!activated) {
            const now = date_end ? date_end : new Date()
            const timerHook = useTimer({start_date:date_start,end_date:now})
            setTime(timerHook)
            clearInterval(interval)
        }

        return () => clearInterval(interval);
      }, []);

    return(
        <View style={styles.row}>
            {
                time?.days>= 1 ? ( 
                    time?.days> 1 ? 
                            <Text style={!mini ? styles.time_days : styles.time_days_mini}>{(time?.days) + ' días' }</Text>
                        :   <Text style={!mini ? styles.time_days : styles.time_days_mini}>{(time?.days) + ' día'}</Text>
                    ) : null
            } 
            <Text style={!mini ? styles.time : styles.time_mini}>{time?.time} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row:{
        flex:1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginTop:10
    },
    time_days:{
        fontSize:25,
        fontWeight:500,
        color:'#87878d',
        padding:0,
        margin:0,
    },
    time:{
        fontSize:48,
        fontWeight:'bold',
        color:'#272727',
        padding:0,
        margin:0,
        top: -10,
    },

    time_days_mini:{
        display:'none',
        fontSize:0,
        fontWeight:500,
        color:'#87878d',
        padding:0,
        margin:0,
    },
    time_mini:{
        fontSize:15,
        fontWeight:'bold',
        color:'#0a0a1e',
        padding:0,
        margin:0,
        bottom:-5,
    },

})
