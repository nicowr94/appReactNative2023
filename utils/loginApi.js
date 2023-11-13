const url_server= 'https://validation.lat' // https://frioteam.ml

export const getUserByToken = async (token, username) => {
    const res = await fetch(url_server + '/usuarios/api/v1/tecnicos/?username='+username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + token
      },
      mode: 'cors', // Agrega esta opción

    })
    const response = await res.json()
    return response
}

export const getToken = async (username, password) => {
    const res = await fetch(url_server + '/api/token/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      mode: 'cors', // Agrega esta opción

    })
    const response = await res.json()
    return response
}