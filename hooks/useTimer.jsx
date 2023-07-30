import React from 'react'

export default function useTimer({start_date,end_date}) {

    const date_base =  new Date ()
    date_base.setUTCFullYear(2000)
    date_base.setUTCDate(1)
    date_base.setUTCMonth(0)
    date_base.setUTCHours(0)
    date_base.setUTCMinutes(0)
    date_base.setUTCSeconds(0)

    const diff =new Date ( date_base.getTime() + (new Date(end_date).getTime()  - new Date(start_date).getTime() )) 
    const days = ((new Date(end_date).getTime() - new Date(start_date).getTime())/ (1000 * 60 * 60 *24))
    const hours = ("0"+(diff.getUTCHours())).slice(-2)
    const minutes = ("0"+(diff.getUTCMinutes())).slice(-2)
    const seconds = ("0"+(diff.getUTCSeconds())).slice(-2)

    const res = { days : Math.floor(days), time : hours +":"+minutes +":"+seconds}
    return res
}
