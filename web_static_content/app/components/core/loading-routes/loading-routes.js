import { LoadingRoutesTemplate } from "./loading-routes-template.html.js";

const LoadingRoutes = {
    template: LoadingRoutesTemplate,
    data: function () {
        return {
            bool_error_state: false,
            str_redirect_url: ''
        }
    },
    mounted: async function(){
        // if (this.$store.state.bool_router_load_complete){
        //     this.$router.push('/dashboard');
        // }
        let int_count = 0;
        let str_initial_route = this.$route.params.redirect;
        if (str_initial_route === undefined){
            str_initial_route = '/dashboard';
        }
        this.str_redirect_url = str_initial_route;
        while(!this.RouterLoadComplete && int_count < 100) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            int_count++
        }
        if (int_count >= 200){
            this.bool_error_state = true
        }else{
            this.$router.push({path: str_initial_route});
        }

    },
    computed: Vuex.mapGetters(['RouterLoadComplete'])
} // end AuthenticatePassword


export { LoadingRoutes }
