import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import MainEditor from '@/views/MainEditor/MainEditor.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'LandingPage',
            component: LandingPage
        },
        {
            path: '/editor',
            name: 'MainEditor',
            component: MainEditor
        }
    ]
})
