import { createRouter, createWebHistory } from '../../node_modules/vue-router'
import Login42 from '../components/Login42.vue'
import MainPage from '../components/MainPage.vue'
import GameMode from '../components/GameMode.vue'
import Chat from '../components/Chat.vue'
import Profile from '../components/Profile.vue'
import App from '../App.vue'
import Pong from '../components/Pong.vue'
import Login from '../components/Login.vue'
import Mode from '../components/ModeTest.vue'
import Stats from '../components/Stats.vue'
import GameHistory from '../components/GameHistory.vue'
import Ladder from '../components/Ladder.vue'
import NotFound from '../components/NotFound.vue'
import ProfileUser from '../components/ProfileUser.vue'
import { authGuard, authGuardUsername, authGuard2fa, authGuardUser } from '../_helper/auth-guard'
import Infos from '../components/InfosChannel.vue'
import Channel from '../components/Channel.vue'
import List from '../components/ListChannels.vue'
import FriendsRequests from '../components/FriendsRequest.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Login },
    { path: '/login', name: 'login', component: Login42 },
    { path: '/main-page', name: 'main', component: MainPage },
    { path: '/game-mode', component: GameMode },
    { path: '/chat/:idchat', component: Chat, props: true },
    { path: '/profile', component: Profile },
    { path: '/profile-user/:id', component: ProfileUser, props: true },
    { path: '/stats', component: Stats },
    { path: '/mode', component: Mode },
    { path: '/game-history/:id', component: GameHistory, props: true },
    { path: '/ladder/:id', component: Ladder, props: true },
    { path: '/infos/:idchannel', component: Infos , props: true},
    { path: '/:pathMatch(.*)*', name: 'error', component: NotFound },
    { path: '/pong', component: Pong },
    { path: '/list-channels', component: List },
    { path: '/channel/:idchannel', name: 'channel', component: Channel, props: true },
    { path: '/friend-request', component: FriendsRequests },
  ]
})

router.beforeEach((to, from, next) => {

  if(to.matched[0].name != 'login' && to.matched[0].name != 'home'
    && to.matched[0].name != 'error') {
    authGuard()
  }

  //block access to all routes except main when authGuardTest is false
  if(to.matched[0].name != 'login' &&to.matched[0].name != 'home' &&
      to.matched[0].name != 'main' && to.matched[0].name != 'error') {
    authGuardUsername()
  }

  if(to.matched[0].name != 'login' &&to.matched[0].name != 'home' &&
  to.matched[0].name != 'main' && to.matched[0].name != 'error') {
    authGuard2fa()
  }
  //use guard on all routes except login and home
  if (to.matched[0].name != 'login' && to.matched[0].name != 'home')
    authGuardUser()

  next()
})

export default router
