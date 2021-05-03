//import { store } from './store.js'
import { MainTemplate} from "./components/core/main/main-template.html.js";
import { NavBar } from "./components/core/nav-bar/nav-bar.js";
import { Header } from "./components/core/header/header.js";
import { Footer } from "./components/core/footer/footer.js";
import {NotFound} from "./components/core/not-found/not-found.js";
import { LoadingRoutes } from "./components/core/loading-routes/loading-routes.js";
import store from './store.js'

const routes = [
    { path: '/:pathMatch(.*)*', component: NotFound },
    { path: '/loading-routes', component: LoadingRoutes, title: 'Loading Routes', name: 'loading-routes'}
]

const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
const app = Vue.createApp({
    name: 'App',
    components: {
        'appNavbar': NavBar,
        'appHeader': Header,
        'appFooter': Footer
    },
    template: MainTemplate,
    mounted: async function() {
        await this.start_get_routes()
    },
    watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                if (to.meta.title === undefined) {
                    document.title = 'Phoenix Framework';
                } else {
                    document.title = to.meta.title + " | Phoenix Framework" || 'Phoenix Framework';
                }

            }
        }
    },
    methods: {
        start_get_routes: async function () {
            const obj_routes_to_add = await get_routes()
            if (!obj_routes_to_add['bool_error']) {
                let arr_routes = obj_routes_to_add['arr_routes'][0]
                for (const route of arr_routes) {
                    //console.log(route)
                    let obj_new_route = {path: '', name: '', meta: {parent:'', title:''}}
                    await import("./components/core/" + route['file_path'])
                        .then(obj => obj_new_route.component = obj[route['component_name']])
                        .catch(err => alert(err))
                    obj_new_route.name = route['name']
                    obj_new_route.path = route['route_path']
                    obj_new_route.meta['title'] = route['page_title']
                    if (route['child_routes'] !== undefined){
                        if (Array.isArray(route['child_routes'])){
                            obj_new_route.children = [];
                            for (const child_route of route['child_routes']) {
                                let obj_new_child_route = {path: '', name: '', meta: {title: '', parent: ''}}
                                await import("./components/core/" + child_route['file_path'])
                                    .then(obj => obj_new_child_route.component = obj[child_route['component_name']])
                                    .catch(err => alert(err))
                                obj_new_child_route.name = child_route['name'];
                                obj_new_child_route.path = child_route['route_path'];
                                obj_new_child_route.meta['parent'] = route['route_path'];
                                if (route['page_title'] === undefined && child_route['page_title'] === undefined){
                                    obj_new_child_route.meta['title'] = undefined;
                                }else if (route['page_title'] === undefined){
                                    obj_new_child_route.meta['title'] = child_route['page_title'];
                                }else if (child_route['page_title'] === undefined){
                                    obj_new_child_route.meta['title'] = route['page_title'];
                                }else{
                                    obj_new_child_route.meta['title'] = route['page_title'] + "\\" + child_route['page_title'];
                                }
                                obj_new_route.children.push(obj_new_child_route);
                            }
                        }
                    }
                    router.addRoute(obj_new_route);
                }
            }
            store.commit('routerLoadComplete')
            //Vuex.mapActions(['increment']);
            //this.increment;
        },

    },

});
app.use(store);
app.use(router);

app.mount('#app');


async function get_routes(){
    let obj_return = {bool_error: false, arr_routes: []}
    await axios.get('/api/core_routes_and_navigation/get_routes', {})
        .then(function (response) { // Non error result in axios
            let data = response.data;
            if (data['bool_error']){
                obj_return.bool_error = true;
            }else{
                obj_return.arr_routes = data['arr_routes']
            }
        })
        .catch(function (error) { // Error result in axios
            console.log(error)
            obj_return.bool_error = true;
            return obj_return;
        });
    return obj_return
} // end get_routes function