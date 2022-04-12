import { $authHost, $host } from "."

export const registerApi = async (nickname, password) => {
  const { data } = await $host.post('api/user/register', { nickname, password })
  return data
}

export const loginApi = async (nickname, password) => {
  const { data } = await $host.post('api/user/login', { nickname, password })
  return data
}

export const checkApi = async () => {
  const { data } = await $authHost.post('api/user/check')
  return data
}

export const meApi = async () => {
  const { data } = await $authHost.get('api/user/me')
  return data
}