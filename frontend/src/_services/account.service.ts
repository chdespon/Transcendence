import {Axios, Axios2fa } from './caller.service'
import { RoomChannelDto } from './room.channel.dto';
import { RoomDto } from './room.dto';
import { MessageDto } from './messages.dto';
import Cookies from 'js-cookie';


////////////////////////////////////////////////////////
//                        USERS                       //
////////////////////////////////////////////////////////
let login = () => {
    return Axios.get('/auth/42/login')
}

let usersMe = () => {
    return Axios.get('/users/me')
}

let getLogin = (dto: object) => {
    return Axios.post('/chat/getlogin', dto);
}

let updateUsername = (username: string) => {
    return Axios.patch('/users/username', { username })
}

let changeUsername = (dto: object) => {
    return Axios.post('/users/changeusername', dto)
}

let findUser = (dto: RoomDto) => {
    return Axios.get('/chat/finduser', { params: { dto }})
}

let generateQr = () => {
    return Axios.get('/2fa/generate', { responseType: 'arraybuffer' })
}

let turnOnTwoFactorAuth = (code: string) => {
    return Axios.post('/2fa/turn-on', { code })
}

let turnOffTwoFactorAuth = () => {
    return Axios.post('/2fa/disable2fa')
}

let authenticate = (code: string) => {
    return Axios2fa.post('/2fa/authenticate', { code })
}

let block = (dto: object) => {
    return Axios.post('users/block', dto)
}

let unblock = (dto: object) => {
    return Axios.post('users/unblock', dto)
}

let isBlocked = (dto: object) => {
    return Axios.post('users/isblocked', dto)
}

let isRequest = (dto: object) => {
    return Axios.post('users/isrequest', dto)
}

let isConnected = (dto: object) => {
    return Axios.post('users/isconnected', dto)
}

let friendsOnline = (dto: object) => {
    return Axios.post('users/friendsonline', dto)
}

let uptadeAvatar = (file: File) => {
    return Axios.post('users/uptadeAvatar', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }})
}


////////////////////////////////////////////////////////
//                        ROOMS                       //
////////////////////////////////////////////////////////
let createRoom = (dto: RoomDto) => {
    return Axios.post('/chat/createroom', dto)
}

let findRoom = (dto: RoomDto) => {
    return Axios.post('/chat/findroom', dto)
}

let createRoomChannel = (dto: RoomChannelDto) => {
    return Axios.post('/chat/createroomchannel', dto)
}

let findRoomChannel = (dto: object) => {
    return Axios.post('/chat/findroomchannel', dto)
}

let editChannel = (dto: RoomChannelDto) => {
    return Axios.post('/chat/editchannel', dto)
}



////////////////////////////////////////////////////////
//                  CHANNELS/FRIENDS                  //
////////////////////////////////////////////////////////
let addFriend = (dto: RoomChannelDto) => {
    return Axios.post('/users/addfriend', dto)
}

let addChannel = (dto: RoomChannelDto) => {
    return Axios.post('/users/addchannel', dto)
}

let removeFriend = (dto: object) => {
    return Axios.post('/users/removefriend', dto)
}

let removeChannel = (dto: object) => {
    return Axios.post('/users/removechannel', dto)
}

let publicsChannels = () => {
    return Axios.get('/chat/publicschannels')
}

let sendFriendRequest = (dto: object) => {
    return Axios.post('/chat/friendsrequests', dto)
}

let removeRequest = (dto: object) => {
    return Axios.post('/chat/removerequest', dto)
}

let removeUser = (dto: object) => {
    return Axios.post('/chat/removeuser', dto)
}

let checkPassword = (dto: object) => {
    return Axios.post('/chat/checkpassword', dto)
}

let isMute = (dto: object) => {
    return Axios.post('/chat/ismute', dto)
}



////////////////////////////////////////////////////////
//                      MESSAGES                      //
////////////////////////////////////////////////////////
let addMessage = (dto: MessageDto) => {
    return Axios.post('/chat/addmessage', dto)
}

let getMsg = (room: String) => {
    return Axios.get('/chat/getmsg', { params: { room } })
}

let addMessageChannel = (dto: MessageDto) => {
    return Axios.post('/chat/addmsgchannel', dto)
}

let getMsgChannel = (room: String) => {
    return Axios.get('/chat/getmsgchannel', { params: { room } })
}

let deleteMsg = (dto: object) => {
    return Axios.post('/chat/deletemsg', dto)
}


////////////////////////////////////////////////////////
//                       TOKENS                       //
////////////////////////////////////////////////////////
let logout = () => {
    Cookies.remove('jwt'),
    Cookies.remove('2fajwt'),
    localStorage.removeItem('token'),
    localStorage.removeItem('2faToken'),
    localStorage.removeItem('2faOn'),
    localStorage.removeItem('validate')
}

let getToken = (token: string) => {
    return localStorage.getItem(token)
}

let saveToken = (token: string) => {
    localStorage.setItem('token', token)
}

let save2FaToken = (token: string) => {
    localStorage.setItem('2faToken', token)
}

let isLogged = () => {
    let token = localStorage.getItem('token')
    return !!token  //transforme une variable (ici: string) en booleen (si vide -> false, sinon true)
}



////////////////////////////////////////////////////////
//                        ADMIN                       //
////////////////////////////////////////////////////////
let ban = (dto: object) => {
    return Axios.post('/admin/ban', dto)
}

let admin = (dto: object) => {
    return Axios.post('/admin/admin', dto)
}

let mute = (dto: object) => {
    return Axios.post('/admin/mute', dto)
}

let password = (dto: object) => {
    return Axios.post('/admin/password', dto)
}

let removePassword = (dto: object) => {
    return Axios.post('/admin/removepassword', dto)
}

let visibility = (dto: object) => {
    return Axios.post('/admin/visibility', dto)
}



////////////////////////////////////////////////////////
//                        GAME                        //
////////////////////////////////////////////////////////
let game = (dto: object) => {
    return Axios.post('/game/game', dto)
}

let getGame = (dto: object) => {
    return Axios.post('/game/getgame', dto)
}

let getGame2 = (dto: object) => {
    return Axios.post('/game/getgame2', dto)
}

let addVictory = (dto: object) => {
    return Axios.post('/users/addvictory', dto)
}

let ladder = () => {
    return Axios.post('/game/ladder')
}


export const accountService = {
    login,
    logout,
    saveToken,
    getToken,
    isLogged,
    usersMe,
    createRoom,
    findRoom,
    createRoomChannel,
    findRoomChannel,
    editChannel,
    addFriend,
    addChannel,
    addMessage,
    getMsg,
    addMessageChannel,
    getMsgChannel,
    updateUsername,
    findUser,
    removeFriend,
    removeChannel,
    publicsChannels,
    sendFriendRequest,
    removeRequest,
    turnOnTwoFactorAuth,
    generateQr,
    turnOffTwoFactorAuth,
    save2FaToken,
    authenticate,
    removeUser,
    ban,
    admin,
    mute,
    password,
    visibility,
    removePassword,
    checkPassword,
    block,
    isBlocked,
    unblock,
    isRequest,
    isConnected,
    friendsOnline,
    isMute,
    uptadeAvatar,
    game,
    getGame,
    getGame2,
    addVictory,
    ladder,
    deleteMsg,
    changeUsername,
    getLogin
}
