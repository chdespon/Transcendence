<script setup lang="ts">
import router from '@/router';
import Borders from './Borders.vue'
import { accountService } from '@/_services';
</script>

<script lang="ts">


export default {
    props: ['idchannel'],
    data() {
        return {
            visibility: '',
            password: '',
            infos: '',
            owner: false,
            isAdmin: false,
            me: '',
            pw: false,
            length: '0',
            login: '', 
            test: []
        }
    },
    methods: {
        change_visibility() {
            if (this.visibility == 'public')
                this.visibility = 'private'
            else
                this.visibility = 'public'

            let dto = { channel: this.idchannel }
            accountService.visibility(dto)
            .catch((res) => console.log(res))
        },
        change_password() {
            let dto = { channel: this.idchannel, user: this.password }
            accountService.password(dto)
            .catch((res) => console.log(res))
            this.password = ''
            this.pw = true
        },
        async removePassword() {
            let dto = { channel: this.idchannel }
            await accountService.removePassword(dto)
            .catch((res) => console.log(res))
            this.pw = false
        },
        async ban(user) {
            let dto = { channel: this.idchannel, user: user }
            await accountService.ban(dto)
            .catch((res) => console.log(res))

            dto = { name: this.idchannel, user_one: user }
            await accountService.removeUser(dto)
            .catch((res) => console.log(res))

            dto = { name: user, user_one: this.idchannel }
            await accountService.removeChannel(dto)
            .catch((res) => console.log(res))


            let channel: RoomChannelDto = { name: this.idchannel }
            await accountService.findRoomChannel(channel)
            .then((response) => { this.infos = response.data })
            .catch (res => console.log(res))

            this.test = []
            for (let i = 0; this.infos.users[i]; i++) {
                let login = await this.getLogin(this.infos.users[i])
                this.test.push( login )
            }
        },
        async remove(user) {
            let dto = { name: this.idchannel, user_one: user }
            await accountService.removeUser(dto)
            .catch((res) => console.log(res))

            dto = { name: user, user_one: this.idchannel }
            await accountService.removeChannel(dto)
            .catch((res) => console.log(res))


            let channel: RoomChannelDto = { name: this.idchannel }
            await accountService.findRoomChannel(channel)
            .then((response) => { this.infos = response.data })
            .catch (res => console.log(res))
        },
        mute(user) {
            let start = new Date();
            let time = start.getTime()
            let dto = { channel: this.idchannel, user: user, date: time.toString() }
            accountService.mute(dto)
            .catch((res) => console.log(res))
        },

        async admin(user) {
            let dto = { channel: this.idchannel, user: user }
            await accountService.admin(dto)
            .catch((res) => console.log(res))

            let channel: RoomChannelDto = { name: this.idchannel }
            await accountService.findRoomChannel(channel)
            .then((response) => { this.infos = response.data })
            .catch (res => console.log(res))
        },
        async getLogin(friend) {
            await accountService.getLogin( { login: friend } )
            .then(res => {
            this.login = res.data
            });
            return (this.login);
        }


    },
    async created() {
      await accountService.usersMe()
      .then((res) => { this.me = res.data })
      .catch (res => console.log(res))

      let dto: RoomChannelDto = { name: this.idchannel }
      await accountService.findRoomChannel(dto)
      .then((response) => {
        this.infos = response.data,
        this.pw = response.data.is_password
      })
      .catch (res => console.log(res))

      if (this.infos && this.infos.users.find(t => t === this.me.id)) {
        if (this.infos.private == true)
            this.visibility = 'private'
        else
            this.visibility = 'public'
        if (this.infos.admin.find(t => t === this.me.id))
            this.isAdmin = true
        if (this.infos.owner == this.me.login)
            this.owner = true
        this.length = this.infos.users.length

        for (let i = 0; this.infos.users[i]; i++) {
            let login = await this.getLogin(this.infos.users[i])
            this.test.push( login )
            // console.log(test)
            // console.log(login)
        }


      }
      else
        router.push('/main-page')
    }
}
</script>

<template>
      <Borders/>
      <div className="main_div">
        <div className="infos">
            <div className="channel_name_infos">
                <h1 className="make_bold">{{ idchannel }}</h1>
                <h1 className="members">{{ length }} members</h1>
            </div>
<!-- 
            <div className="user_list_infos">
                <li v-for="user in infos.users" :key="user.id">
                    <div className="admin_access">
                        <RouterLink :to="'/profile-user/' + user" v-if="infos.admin.find(t => t === user)" className="admin">{{ user }}</RouterLink>
                        <h1 v-if="infos.admin.find(t => t === user)" className="admin_info">admin</h1>
                        <RouterLink :to="'/profile-user/' + user" v-else className="not_admin">{{ user }}</RouterLink>
                        <button v-if="isAdmin && !infos.admin.find(t => t === user)" className="button_admin" @click="ban(user)"><font-awesome-icon icon="fa-solid fa-user-xmark" /></button>
                        <button v-if="isAdmin && !infos.admin.find(t => t === user)" className="button_admin" @click="remove(user)"><font-awesome-icon icon="fa-solid fa-user-minus" /></button>
                        <button v-if="isAdmin && !infos.admin.find(t => t === user)" className="button_admin" @click="mute(user)"><font-awesome-icon icon="fa-solid fa-comment-slash" /></button>
                        <button v-if="isAdmin && !infos.admin.find(t => t === user)" className="button_admin" @click="admin(user)"><font-awesome-icon icon="fa-solid fa-user-tie" /></button>
                    </div>
                </li>
            </div> -->


            <div className="user_list_infos">
                <!-- <li v-for="user in infos.users" :key="user.id"> -->
                <li v-for="user in test" :key="user.id">
                    <div className="admin_access">
                        <RouterLink :to="'/profile-user/' + user" v-if="infos.admin.find(t => t === user.id)" className="admin">{{ user.login }}</RouterLink>
                        <RouterLink :to="'/profile-user/' + user" v-else className="not_admin">{{ user.login }}</RouterLink>
                        <button v-if="isAdmin && infos.owner != user.login && me.login != user.login" className="button_admin" title="Ban" @click="ban(user.id)"><font-awesome-icon icon="fa-solid fa-user-xmark" /></button>
                        <button v-if="isAdmin && infos.owner != user.login && me.login != user.login" className="button_admin" title="Kick" @click="remove(user.id)"><font-awesome-icon icon="fa-solid fa-user-minus" /></button>
                        <button v-if="isAdmin && infos.owner != user.login && me.login != user.login" className="button_admin" title="Mute" @click="mute(user.id)"><font-awesome-icon icon="fa-solid fa-comment-slash" /></button>
                        <button v-if="isAdmin && !infos.admin.find(t => t === user.id)" className="button_admin" title="Make admin" @click="admin(user.id)"><font-awesome-icon icon="fa-solid fa-user-tie" /></button>
                        <h1 v-if="infos.admin.find(t => t === user.id)" className="admin_info">admin</h1>
                    </div>
                </li>
            </div>

            <div className="private_public">
                <button v-if="owner" @click="change_visibility" className="public_button">{{ visibility }}</button>
                <div className="div_pw">
                    <form v-if="owner" @submit.prevent="change_password">
                        <input className="set_password" v-model="password" placeholder='set password' :maxlength="9">
                    </form>
                    <button v-if="owner && pw" @click="removePassword()" className="remove_pw_button">Remove password</button>
                    <h1 v-if="!owner">{{ visibility }}</h1>
                </div>

            </div>
        </div>

    </div>
  </template>





<!--  change username  -->
<!--
    message -> where login == old login
    login: new login

    >>>>>>> CA MARCHERA PAS EN FAIT

-->




<!--  in game  -->










<!-- 
warn]: Unhandled error during execution of mounted hook 
  at <Login42 onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {…} > > 
  at <RouterView> 
  at <App>
warn2 @ runtime-core.esm-bundler.js:40
logError @ runtime-core.esm-bundler.js:230
handleError @ runtime-core.esm-bundler.js:222
(anonymous) @ runtime-core.esm-bundler.js:185
Promise.catch (async)
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js:184
hook.__weh.hook.__weh @ runtime-core.esm-bundler.js:2731
flushPostFlushCbs @ runtime-core.esm-bundler.js:359
flushJobs @ runtime-core.esm-bundler.js:413
Promise.then (async)
queueFlush @ runtime-core.esm-bundler.js:298
queuePostFlushCb @ runtime-core.esm-bundler.js:320
queueEffectWithSuspense @ runtime-core.esm-bundler.js:1604
scheduler @ runtime-core.esm-bundler.js:1838
triggerEffect @ reactivity.esm-bundler.js:400
triggerEffects @ reactivity.esm-bundler.js:390
triggerRefValue @ reactivity.esm-bundler.js:1021
(anonymous) @ reactivity.esm-bundler.js:1158
triggerEffect @ reactivity.esm-bundler.js:400
triggerEffects @ reactivity.esm-bundler.js:385
triggerRefValue @ reactivity.esm-bundler.js:1021
(anonymous) @ reactivity.esm-bundler.js:1158
triggerEffect @ reactivity.esm-bundler.js:400
triggerEffects @ reactivity.esm-bundler.js:385
triggerRefValue @ reactivity.esm-bundler.js:1021
set value @ reactivity.esm-bundler.js:1066
finalizeNavigation @ vue-router.mjs?v=ddfe1515:3334
(anonymous) @ vue-router.mjs?v=ddfe1515:3207
Promise.then (async)
pushWithRedirect @ vue-router.mjs?v=ddfe1515:3174
push @ vue-router.mjs?v=ddfe1515:3099
navigate @ vue-router.mjs?v=ddfe1515:2189
callWithErrorHandling @ runtime-core.esm-bundler.js:173
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js:182
invoker @ runtime-dom.esm-bundler.js:345
Login42.vue:10 Uncaught (in promise) 
mounted @ Login42.vue:10
Promise.catch (async)
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js:184
hook.__weh.hook.__weh @ runtime-core.esm-bundler.js:2731
flushPostFlushCbs @ runtime-core.esm-bundler.js:359
flushJobs @ runtime-core.esm-bundler.js:413
Promise.then (async)
queueFlush @ runtime-core.esm-bundler.js:298
queuePostFlushCb @ runtime-core.esm-bundler.js:320
queueEffectWithSuspense @ runtime-core.esm-bundler.js:1604
scheduler @ runtime-core.esm-bundler.js:1838
triggerEffect @ reactivity.esm-bundler.js:400
triggerEffects @ reactivity.esm-bundler.js:390
triggerRefValue @ reactivity.esm-bundler.js:1021
(anonymous) @ reactivity.esm-bundler.js:1158
triggerEffect @ reactivity.esm-bundler.js:400
triggerEffects @ reactivity.esm-bundler.js:385
triggerRefValue @ reactivity.esm-bundler.js:1021
(anonymous) @ reactivity.esm-bundler.js:1158
triggerEffect @ reactivity.esm-bundler.js:400
triggerEffects @ reactivity.esm-bundler.js:385
triggerRefValue @ reactivity.esm-bundler.js:1021
set value @ reactivity.esm-bundler.js:1066
finalizeNavigation @ vue-router.mjs?v=ddfe1515:3334
(anonymous) @ vue-router.mjs?v=ddfe1515:3207
Promise.then (async)
pushWithRedirect @ vue-router.mjs?v=ddfe1515:3174
push @ vue-router.mjs?v=ddfe1515:3099
navigate @ vue-router.mjs?v=ddfe1515:2189
callWithErrorHandling @ runtime-core.esm-bundler.js:173
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js:182
invoker @ runtime-dom.esm-bundler.js:345 -->