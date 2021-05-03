
import MainPage from 'core/not-found/page';

const NotFound = { comment: MainPage }
const Login = { template: ''}
const About = { template: '<p>about page</p>' }

const routes = {
    '/login': Login,
    '/about': About
}

new Vue({
    el: '#authApp',
    data: {
        currentRoute: window.location.pathname
    },
    computed: {
        ViewComponent () {
            return routes[this.currentRoute] || NotFound
        }
    },
    render (h) { return h(this.ViewComponent) }
})
