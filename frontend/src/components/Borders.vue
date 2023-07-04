<script lang="ts">
import { accountService } from '@/_services'
import { RoomChannelDto }  from '@/_services/room.channel.dto'
import router from '@/router';
import io from "socket.io-client"
// import $socketUser from '../plugin/socket.user.ts';

export type users_type = {
  username: string
}

const { VITE_APP_BACKEND_PORT: port, VITE_APP_HOST: host } = await import.meta.env;



// let socket = io('http://localhost:3000/user',
// { 
//     transports: ["websocket"],
//     forceNew: true,
//     upgrade: false,
// }
// );


// socket.auth = { name: 'elisa' };
// let socket = $socketUser;

export default {
    data() {

        let users: users_type = {username: ''}

        return {
          users: users,
          test_friend: '',
          test_channel: '',
          search_user: '',
          user_not_exist: false,
          friend: false,
          channel: false,
          channels_friends: true,
          newFriend: '',
          newChannel: '',
          friends: '',
          channels: '',
          token: '',
          connected: false,
          create_channel: false,
          user_test: '',
          my_username: '',
          exist: '',
          channel_exist: '',
          request: '',
          jsp: '',
          password: false,
          check_password: '',
          friends_online: '',
          test_friend_login: '',
          list_friend: [],
          testtt:''
        }
    },
    methods: {
      change_friend() {
        this.friend = !this.friend
      },

      change_channel() {
        this.channel = !this.channel
      },

      friend_menu(name) {
        this.friend = !this.friend,
        this.test_friend = name
      },

      channel_menu(name: string) {
        this.test_channel = name
        this.channel = !this.channel
      },

      show_channels() {
        this.friend = false
        this.channels_friends = false
      },

      show_friends() {
        this.channel = false
        this.channels_friends = true
      },

      // async addFriend() {
      //   if (this.validateInput(this.newFriend)) {

      //     let user: object = { login: this.newFriend }
      //     await accountService.findUser(user)
      //       .then(res => { this.exist = res.data })
      //       .catch(res => console.log(res))

      //     if (this.exist && this.newFriend != this.my_username) {
      //       let is_blocked = await accountService.isBlocked({ name: this.newFriend , user_one: this.my_username })
      //       if (is_blocked.data == false) {
      //         accountService.sendFriendRequest({ name: this.newFriend, user_one: this.my_username })
      //           .catch(res => console.log(res))
      //       }
      //     }
      //     this.newFriend = ''
      //   }
      // },

      async addFriend() {
        if (this.validateInput(this.newFriend)) {

          let user: object = { login: this.newFriend }
          await accountService.findUser(user)
            .then(res => { this.exist = res.data })
            .catch(res => console.log(res))

          if (this.exist && this.newFriend != this.my_username) {
            let is_blocked = await accountService.isBlocked({ name: this.newFriend , user_one: this.users.id })
            if (is_blocked.data == false) {
              accountService.sendFriendRequest({ name: this.newFriend, user_one: this.users.id })
                .catch(res => console.log(res))
            }
          }
          this.newFriend = ''
        }
      },

      // removeFriend(friends: friend_type) {

      //   let friend: object = { name: this.my_username, user_one: friends }
      //   accountService.removeFriend(friend)
      //     .catch(res => console.log(res))

      //   let second_friend: object = { name: friends, user_one: this.my_username }
      //   accountService.removeFriend(second_friend)
      //     .catch(res => console.log(res))

      //   this.friend = false
      //   this.friends = this.friends.filter((t) => t !== friends)
      //   // let online = this.friends_online.find({login: friends, online: true})
      //   // if (!online)
      //   //   online = this.friends_online.find({login: friends, online: false})

      //   // this.friends_online = this.friends_online.filter((t) => t !== online)
      // },


      removeFriend(friends) {

        let friend: object = { name: this.users.id, user_one: friends.id }
        accountService.removeFriend(friend)
          .catch(res => console.log(res))

        let second_friend: object = { name: friends.id, user_one: this.users.id }
        accountService.removeFriend(second_friend)
          .catch(res => console.log(res))

        this.friend = false
        this.friends = this.friends.filter((t) => t !== friends.login)
        // let online = this.friends_online.find({login: friends, online: true})
        // if (!online)
        //   online = this.friends_online.find({login: friends, online: false})

        this.friends_online = this.friends_online.filter((t) => t !== friends)
        },

      addChannel() {
        if (this.validateInput(this.newChannel)) {
          let dto: RoomChannelDto = { name: this.newChannel, users: [ this.users.id ], id: this.my_username }
          this.channels.push( this.newChannel )
          accountService.createRoomChannel(dto)
            .catch (res => console.log(res))
          let dtoo: RoomChannelDto = { name: this.users.id, users: [ this.newChannel ] }
          accountService.addChannel(dtoo)
            .catch (res => console.log(res))
          this.newChannel = ''
          this.create_channel = false
        }
      },

      removeChannel(channels: friend_type) {
          let channel: object = { name: this.my_username, user_one: channels }
          accountService.removeChannel(channel)
            .catch (res => console.log(res))
          let dto: object = { name: channels, user_one: this.my_username }
          accountService.removeUser(dto)
            .catch (res => console.log(res))
          this.channel = false
          this.channels = this.channels.filter((t) => t !== channels)
      },

      async search_users() {
        if (this.validateInput(this.search_user)) {

          let find: object = { login: this.search_user }
          await accountService.findUser(find)
            .then(res => { this.exist = res.data })
            .catch (res => console.log(res))

          if (this.exist) {
            await router.push('/profile-user/' + this.exist.id)
            router.go()
          }
          else
            this.user_not_exist = true
        }
        this.search_user = ''
      },

      create_channel_close() {
        this.create_channel = false,
        this.newChannel = ''
      },

      async createChannel() {
        await accountService.findRoomChannel({ name: this.newChannel })
          .then(res => this.channel_exist = res.data )
          .catch(res => console.log(res))
          
          this.jsp =  this.channels.find(t => t === this.newChannel)
          if (this.channel_exist == '')
            this.create_channel = true
          else if (!this.jsp)
          {
            this.create_channel = false

            if (this.channel_exist.is_password == true)
              this.password = true
            else {
              this.channels.push( this.newChannel )
              accountService.editChannel({ name: this.newChannel, users: [ this.users.id ] })
              .catch (res => console.log(res))
              let dtoo: RoomChannelDto = { name: this.users.id, users: [ this.newChannel ] }
              accountService.addChannel(dtoo)
              .catch (res => console.log(res))
              this.newChannel = ''
            }
          }
          else {
            this.newChannel = ''
          }
      },

      async checkPassword() {
          let dto = { name: this.newChannel, users: [ this.check_password ] }
          await accountService.checkPassword(dto)
          .then((res) => this.check_password = res.data )
          .catch((res) => console.log(res))

          if (this.check_password == true) {
            this.channels.push( this.newChannel )
            accountService.editChannel({ name: this.newChannel, users: [ this.users.id ] })
            .catch (res => console.log(res))
            let dtoo: RoomChannelDto = { name: this.my_username, users: [ this.newChannel ] }
            accountService.addChannel(dtoo)
            .catch (res => console.log(res))
          }
          this.check_password = ''
          this.newChannel = ''
          this.password = false
      },

      validateInput(text: string) {
        return text.length > 0
      },

      async go_to(route: string) {
        await router.push('/chat/' + route)
        router.go()
      },

      async go_to_channel(route: string) {
        await router.push('/channel/' + route)
        router.go()
      },
      
      async go_to_info(route: string) {
        await router.push('/infos/' + route)
        router.go()
      },

      async go_to_profile(route: string) {
        await router.push('/profile-user/' + route)
        router.go()
      },

      async block() {
        await accountService.block({ name: this.users.id, user_one: this.test_friend_login.id })
        .catch((res) => console.log(res))

        await accountService.removeFriend({ name: this.users.id, user_one: this.test_friend_login.id })
          .catch(res => console.log(res))

        await accountService.removeFriend({ name: this.test_friend_login.id, user_one: this.users.id })
          .catch(res => console.log(res))

        this.friend = false
        this.friends = this.friends.filter((t) => t !== this.test_friend_login.id)
      },

      async isConnected(friend)
      {
        await accountService.isConnected({ name: friend })
        .then(res => { this.connected = res.data })
        .catch (res => console.log(res))
        return (true)
      },

      async getLogin(friendss) {
        await accountService.getLogin( { login: friendss } )
        .then(res => {
          this.test_friend_login = res.data.login,
          this.testtt = res.data
        });
        return (this.testtt);
      },

      async socket_connected(login) {
        for (let i = 0; this.list_friend[i]; i++) {
            if (this.list_friend[i].id == login.name){
              this.list_friend[i].online = true
            }
        }
      },
      
      async socket_disconnected(login) {
        for (let i = 0; this.list_friend[i]; i++) {
            if (this.list_friend[i].id == login.name) {
              this.list_friend[i].online = false
            }
        }
      }

    },

    async created() {
      await accountService.usersMe()
      .then((response) => {
        this.user_test = response.data
        this.friends = response.data.friends
        this.channels = response.data.channels
        this.users = response.data
        this.my_username = this.users.login
        this.request = response.data.requests
      })
      .catch (res => console.log(res))

      if (this.my_username) {
        await accountService.friendsOnline({ login: this.users.id })
        .then(res => { 
          this.friends_online = res.data
      })
        .catch (res => console.log(res))


        let $socket = io(`ws://${host}:${port}/user`, { 
            transports: ["websocket"],
            forceNew: true,
            upgrade: false,
        });
        $socket.auth = { name: this.user_test.id }
        
        $socket.on('connection', (data) => {
            this.socket_connected(data.login)
        })

        $socket.on('disconnection', (data) => {
            this.socket_disconnected(data.login)
        })

        for (let i = 0; this.friends_online[i]; i++) {
            let login = await this.getLogin(this.friends_online[i].id)
            this.list_friend.push( login )
        }

      }

    },
}
</script>

<template>
  <div className="friend_menu" v-if="friend">
    <RouterLink :to="'/profile-user/' + test_friend.id" className="elements_menu" @click="go_to_profile(test_friend.id)" v-if="friend">Profile</RouterLink>
    <button ref="button" className="elements_menu" v-if="friend" @click="removeFriend(test_friend)">Unfriend</button>
    <RouterLink :to="'/chat/' + test_friend.id" className="elements_menu" @click="go_to(test_friend.id)" v-if="friend">Chat</RouterLink>
    <!-- <button className="elements_menu" v-if="friend" @click="go_to(test_friend)">Chat</button> -->
    <!-- <button className="elements_menu" v-if="friend">Watch the game</button>
    <button className="elements_menu" v-if="friend">Invite to channel ></button> -->
    <button className="elements_menu" v-if="friend" @click="block">Block</button>
    <button className="close_menu" v-if="friend" @click="change_friend">close</button>
  </div>

  <div className="channel_menu" v-if="channel">
    <RouterLink :to="'/channel/' + test_channel" className="elements_menu" @click="go_to_channel(test_channel)" v-if="channel">Chat</RouterLink>
    <button className="elements_menu" v-if="channel" @click=removeChannel(test_channel)>Quit</button>
    <RouterLink :to="'/infos/' + test_channel" className="elements_menu" v-if="channel" @click="go_to_info(test_channel)">Infos</RouterLink>
    <button className="close_menu" v-if="channel" @click="change_channel">close</button>
  </div>

  <div className="borders_div">

    <div className="borders_right">
      <div className="border_right_top">
        <div className="border_right_top_left">
          <h1 className="routers_profile">{{ this.my_username }}</h1>
        </div>
        <div className="border_right_top_right">
          <RouterLink to="/profile" className="routers_profile"><img className="img_border" :src="user_test.avatarUrl" /></RouterLink>
        </div>
      </div>






      <div className="border_right_bottom">

        <div v-if="channels_friends" className="border_right_bottom_one">
          <div className="border_right_bottom_one_left">
            <button @click="show_friends" className="button_channel_friends_ok">friends</button>
          </div>
          <div className="border_right_bottom_one_right">
            <button @click="show_channels" className="button_channel_friends">Channels</button>
          </div>
        </div>

        <div v-else className="border_right_bottom_one">
          <div className="border_right_bottom_one_left">
            <button @click="show_friends" className="button_channel_friends">friends</button>
          </div>
          <div className="border_right_bottom_one_right">
            <button @click="show_channels" className="button_channel_friends_ok">Channels</button>
          </div>
        </div>






        <div className="border_right_bottom_two">
          <form v-if="channels_friends" @submit.prevent="addFriend"  className="border_right_bottom_two">
            <input className="placeholder_search_friends" pattern="[a-zA-Z]+" title="only letters accepted" v-model="newFriend" placeholder='add friends' :maxlength="9">
          </form>
          <form v-else @submit.prevent="createChannel" className="border_right_bottom_two">
            <input className="placeholder_search_friends" pattern="[a-zA-Z]+" title="only letters accepted" v-model="newChannel" placeholder='search channel' :maxlength="9">
          </form>

        <div v-if="create_channel" className="create_channel">
          <h1>This channel doesn't exist</h1>
          <h1>Do you want to create it?</h1>
          <div className="yes_no">
            <button @click="create_channel_close" className="button_no">no</button>
            <button @click="addChannel" className="button_yes">yes</button>
          </div>
        </div>

        <div v-if="password" className="create_channel">
          <h1>Password?</h1>
          <form @submit.prevent="checkPassword">
            <input className="placeholder_password" v-model="check_password" pattern="[a-zA-Z]+" title="only letters accepted" placeholder='password' :maxlength="9">
          </form>
        </div>

        </div>
        <div v-if="channels_friends" className="border_right_bottom_three">
          <ul>
            <h1 v-if="!friends.length && !friends_online.length" className="no_friends">you don't have any friends</h1>
            <h1 v-if="!friends.length && !friends_online.length" className="no_friends"><font-awesome-icon icon="fa-regular fa-face-sad-tear" /></h1>

            <li v-for="friend_list in list_friend" className="friends_usernames">
              <button @click="friend_menu(friend_list)" className="friends_usernames">{{ friend_list.login }}</button>
              <!-- <button @click="friend_menu(friend_list)" v-if="test(friend_list.login)" className="friends_usernames">aaaaaaaa</button> -->
              <h1 className="connected" v-if="friend_list.online"><font-awesome-icon icon="fa-solid fa-circle" /></h1>
              <h1 className="not_connected" v-else><font-awesome-icon icon="fa-solid fa-circle" /></h1>
            </li>
            
            <!-- <li v-for="friend in friends_online" className="friends_usernames">
              <button @click="friend_menu(friend)" v-if="getLogin(friend.id)" className="friends_usernames">{{ test_friend_login }}</button>
              <h1 className="connected" v-if="friend.online"><font-awesome-icon icon="fa-solid fa-circle" /></h1>
              <h1 className="not_connected" v-else><font-awesome-icon icon="fa-solid fa-circle" /></h1>
            </li> -->


          </ul>
        </div>
        <div v-else className="border_right_bottom_three">
          <ul>
            <h1 v-if="!channels.length" className="no_friends">you haven't joined channels</h1>
            <h1 v-if="!channels.length" className="no_friends"><font-awesome-icon icon="fa-regular fa-face-grimace" /></h1>
            <li v-for="channel in channels" className="friends_usernames">
              <button @click="channel_menu(channel)" className="friends_usernames"><font-awesome-icon icon="fa-solid fa-users" />{{ channel }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="borders_middle">

      <div className="border_middle_top">

        <div className="border_middle_top_left">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </div>

        <div className="border_middle_top_right">
          <form @submit.prevent="search_users" className="placeholder_search">
            <input className="placeholder_search" v-model="search_user" pattern="[a-zA-Z]+" title="only letters accepted" placeholder='search' :maxlength="9">
          </form>
        </div>
      </div>
      <div className="border_middle_two">
          <h1 v-if="user_not_exist" className="msg_error_search_user">user doesn't exist</h1>
      </div>

    </div>

    <div className="borders_left">
      <RouterLink to="/main-page" className="icons_border_left"><font-awesome-icon icon="fa-solid fa-house" /></RouterLink>
      <RouterLink to="/game-mode" className="icons_border_left"><font-awesome-icon icon="fa-solid fa-gamepad" /></RouterLink>
      <RouterLink to="/stats" className="icons_border_left"><font-awesome-icon icon="fa-solid fa-chart-simple" /></RouterLink>
      <RouterLink to="/list-channels" className="icons_border_left"><font-awesome-icon icon="fa-solid fa-comment" /></RouterLink>
      <RouterLink v-if="!request.length" to="/friend-request" className="icons_border_left"><font-awesome-icon icon="fa-solid fa-user-plus" /></RouterLink>
      <div v-else className="icons_border_left">
        <RouterLink to="/friend-request" className="icons_border_left_request"><font-awesome-icon icon="fa-solid fa-user-plus" /></RouterLink>
        <h1 className="request_icon"><font-awesome-icon icon="fa-solid fa-circle" /></h1>
      </div>
      <RouterLink to="/profile" className="icons_border_left"><font-awesome-icon icon="fa-solid fa-gear" /></RouterLink>

    </div>

  </div>

</template>
