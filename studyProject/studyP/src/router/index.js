import Vue from 'vue'
import Router from 'vue-router'
import home from './home';

Vue.use(Router);

export const routes = [
    ...home,
]

const router = new Router({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes
})

export default router;
