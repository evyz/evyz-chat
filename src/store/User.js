import { makeAutoObservable } from 'mobx'

export default class UserStore {
  constructor() {
    this._isDark = true
    this._isAutoDark = false
    this._isAuth = false

    this._isWellcome = false

    this._user = {}
    this._users = []

    this._chats = []
    this._currentChat = []
    this._ws = null

    this._isWriting = {}

    makeAutoObservable(this)
  }

  setIsDark(bool) {
    this._isDark = bool
  }
  setIsAutoDark(bool) {
    this._isAutoDark = bool
  }

  setIsAuth(bool) {
    this._isAuth = bool
  }
  setIsWellcome(bool) {
    this._isWellcome = bool
  }

  setUser(obj) {
    this._user = obj
  }
  setUsers(arr) {
    this._users = arr
  }

  setChats(arr) {
    this._chats = arr
  }
  setCurrentChat(arr) {
    this._currentChat = arr
  }

  setWs(str) {
    this._ws = str
  }

  setIsWriting(obj) {
    this._isWriting = obj
  }

  get isDark() {
    return this._isDark
  }
  get isAutoDark() {
    return this._isAutoDark
  }

  get isAuth() {
    return this._isAuth
  }

  get isWellcome() {
    return this._isWellcome
  }

  get getUser() {
    return this._user
  }

  get users() {
    return this._users
  }

  get chats() {
    return this._chats
  }

  get currentChat() {
    return this._currentChat
  }

  get ws() {
    return this._ws
  }

  get isWriting() {
    return this._isWriting
  }

}