import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'

import { AuthenticatePassword } from './components/core/authenticate-password/authenticate-password.js'
import { ResetPassword } from "./components/core/resetpassword/reset-password.js";
import {NotFound} from "./components/core/not-found/not-found.js";
import { MainTemplate} from "./components/core/main/main-template.html.js";

Vue.use(VueRouter)

let routes = [
    {
        path: '/login',
        component: AuthenticatePassword,
        name: "Login"
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/reset-password',
        component: ResetPassword,
        name: "Change Password"
    },
    {
        path: '*', component: NotFound, title:'404 error'
    }
]

const router = new VueRouter({
    routes
})


new Vue({
    el: '#authApp', // This should be the same as your <div id=""> from earlier.
    template: MainTemplate,
    router
})
