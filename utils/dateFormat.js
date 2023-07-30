export const formatDateType = (d, type) => {
    if( typeof d === 'string' && d.includes("aN")) return
    let date = new Date(d) // por si se envia un string
    let day, month, year, hour, minutes, seconds;
    if(isNaN(date)) {
        let dateString = d.split("/");

        if (dateString.length === 1) dateString = d.split("-");
        const newDate = (dateString[2] + "-" + dateString[1] + "-" + dateString[0]).replaceAll(' ', '')
        date = new Date(newDate);

        day = date.getUTCDate();
        month = date.getUTCMonth() + 1;
        year = date.getUTCFullYear();
    }else{
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        hour = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
    }
    let res = ''

    // "2023-05-04 9:51:52"

    switch (type) {
        case 'HH:MM:SS':
            res = complete0(hour)+':'+complete0(minutes)+':'+complete0(seconds)
            break
        case 'DD/MM/YYYY':
            res = complete0(day)+'/'+complete0(month)+'/'+year
            break
        case 'DD/MM/YYYY HH:MM:SS':
            res = complete0(day)+'/'+complete0(month)+'/'+year+' '+complete0(hour)+':'+complete0(minutes)+':'+complete0(seconds)
            break
        case 'DD/MM/YYYY HH:MM':
            res = complete0(day)+'/'+complete0(month)+'/'+year+' '+complete0(hour)+':'+complete0(minutes)
            break
        case 'YYYY/MM/DD HH:MM:SS':
            res = year +"-" +complete0(month)+'-'+complete0(day)+' '+complete0(hour)+':'+complete0(minutes)+':'+complete0(seconds)
            break
        default:
            res = complete0(day)+'/'+complete0(month)+'/'+year
      }
    
    return res
  
}

const complete0 = (number) =>{
    return ("0"+number).slice(-2)
}