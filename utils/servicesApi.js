const url_server= 'https://validation.lat' // https://frioteam.ml

export const getServicesByState = async (token, state, id) => {
    const res = await fetch(url_server + '/tecnico/app-movil/cotizacion/?estado='+state+'&tecnico_pk='+id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + token
      },
      mode: 'cors'
    })
    const response = await res.json()
    return response
}


export const getServicesById = async (token, id) => {
  const res = await fetch(url_server + '/tecnico/app-movil/cotizacion/?cotizacion_id='+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    mode: 'cors'
  })
  const response = await res.json()
  return response
}

export const getActivitiesByProjectId = async (token, user_id, project_id) => {
  const res = await fetch(url_server + '/tecnico/app-movil/actividades-tecnico/?tecnico_pk='+user_id+'&cotizacion_pk='+project_id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    mode: 'cors'
  })
  const response = await res.json()
  return response
}

export const getIdNewActivitiesByProjectId = async (token, user_id, project_id) => {
  const res = await fetch(url_server + '/tecnico/app-movil/actividades-tecnico/?tecnico_pk='+user_id+'&cotizacion_pk='+project_id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    mode: 'cors'
  })
  const response = await res.json()
  const newID = response.actividades.sort(function(a,b){return b.id - a.id;})[0].id
  return response
}

export const getActividadesLabor = async (token) => {
  const res = await fetch(url_server + '/tecnico/app-movil/tipos-actividades-labores/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    mode: 'cors'
  })
  const response = await res.json()
  return response
}



export const postCreateActivitiesByCotizacion = async (token, activities) => {
  const res = await fetch(url_server + '/tecnico/app-movil/actividad/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    body: JSON.stringify({
      actividades: activities
    }),
    mode: 'cors'
  })
  const response = await res.json()
  //  {"detail": "Actividades creadas correctamente"}
  return response
}

export const closedProjectByID = async (token, id_project, date) => {
  console.log('token', token);
  console.log('id_project', id_project);
  console.log('date', date);

  const res = await fetch(url_server + '/tecnico/app-movil/terminar-proyecto/'+id_project+"/", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    body: JSON.stringify({
      "f_terminado": date
    }),
    mode: 'cors'
  })
  const response = await res.json()
  console.log('response', response);
  return response
}

export const getSolicitudes = async (token, id_tecnico) => {
  const res = await fetch(url_server + '/tecnico/app-movil/solicitudes-cambio/?tecnico_pk='+id_tecnico, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    mode: 'cors'
  })
  const response = await res.json()
  return response
}

export const getSites = async (token) => {
  const res = await fetch(url_server + '/tecnico/app-movil/ubicacion-actividad/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    mode: 'cors'
  })
  const response = await res.json()
  return response
}

export const postSaveAsistencia = async (token, data) => {
  console.log('postSaveAsistencia', data);
  const res = await fetch(url_server + '/tecnico/app-movil/asistencia/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    },
    body: JSON.stringify({
      "tecnico": data.tecnico,
      "fecha_hora_ingreso": data.fecha_hora_ingreso,
      "fecha_hora_salida": data.fecha_hora_salida,
      "lat_long_ingreso": data.lat_long_ingreso,
      "lat_long_salida": data.lat_long_salida,
    }),
    mode: 'cors'
  })
  const response = await res.json()
  console.log('response', response);
  //  {"detail": "Actividades creadas correctamente"}
  return response
}
