export const getUserByToken = async (token, username) => {
    const res = await fetch('https://frioteam.ml/usuarios/api/v1/tecnicos/?username='+username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + token
      }
    })
    const response = await res.json()
    return response
}

export const getToken = async (username, password) => {
    const res = await fetch('https://frioteam.ml/api/token/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    const response = await res.json()
    return response
}