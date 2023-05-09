import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faMagnifyingGlass, faUser, faUsers, faHouse, faGamepad, faChartSimple, faComment, faGear, faCircle } from '@fortawesome/free-solid-svg-icons'
import { faFaceLaughBeam, faCircleUser, faFaceSadTear, faFaceGrimace} from '@fortawesome/free-regular-svg-icons'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueChatScroll from 'vue-chat-scroll';

import './assets/main.css'
import './assets/login.css'
import './assets/log.css'
import './assets/gamemode.css'
import './assets/main_page.css'
import './assets/chat.css'
import './assets/profile.css'
import './assets/border.css'
import './assets/stats.css'
import './assets/stat.css'
import './assets/infos.css'

/* add each imported icon to the library */
library.add(faUserSecret, faFaceLaughBeam, faCircleUser, faMagnifyingGlass, faUser, faUsers, faHouse, faGamepad, faChartSimple, faComment, faGear, faFaceSadTear, faFaceGrimace, faCircle)

const app = createApp(App).use(router, VueAxios, axios)
.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
// app.config.globalProperties.axios=axios
// app.component('font-awesome-icon', FontAwesomeIcon)
// app.mount('#app')
