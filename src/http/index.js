import axios from "axios";

export const url = 'http://localhost:7070/'

const $host = axios.create({
  baseURL: url
})

const $authHost = axios.create({
  baseURL: url
})

const authInterceptor = config => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
  $host,
  $authHost
}