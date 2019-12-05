import Vue from 'vue'
import JRouter from './JRouter'
import Home from '../views/Home.vue'

Vue.use(JRouter)

export default new JRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        }
    ]
})
