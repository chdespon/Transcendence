<script setup lang="ts">
import { accountService } from '@/_services';
import Borders from './Borders.vue'
</script>

<script lang="ts">
export default {
    data() {
        return {
            msg: 'test log',
            count: 0,
            titleClass: 'title',
            me: ''
        }
    },
    created() {
        accountService.usersMe()
        .then(res => this.me = res.data)
        .catch (res => console.log(res))
    }
}
</script>



<template>
    <Borders/>    
    <div className="main_div">
        <div className="stats_div">
            <div className="stats_one_div">
                <RouterLink :to="'/game-history/' + me.id" className="stats_routers">Game history</RouterLink>
            </div>
            <div className="stats_two_div">
                <RouterLink :to="'/ladder/' + me.id" className="stats_routers">Ladder</RouterLink>
            </div>
        </div>
    </div>
</template>
