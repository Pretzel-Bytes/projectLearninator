import { NotFoundTemplate } from "./not-found-template.html.js";

const NotFound = {
    template: NotFoundTemplate,
    mounted: async function(){
        // let int_count = 0;
        // let str_initial_route = '';
        // while(!this.$store.state.bool_router_load_complete && int_count < 100) {
        //     console.log(this.$router.currentRoute.value.fullPath);
        //     if (str_initial_route === ''){
        //         str_initial_route = this.$store.state.str_initial_route;
        //     }
        //     console.log(this.$store.state.str_initial_route)
        //     console.log(this.$store.state.bool_router_load_complete)
        //     await new Promise(resolve => setTimeout(resolve, 50))
        //     console.log(int_count)
        //     int_count++
        // }
        // if (int_count >= 100){
        //
        // }else{
        //     this.$router.push(str_initial_route);
        // }
        if (!this.RouterLoadComplete){
            this.$router.push({name: 'loading-routes', params: { redirect: this.$router.currentRoute.value.fullPath } });
        }
    },
    computed: Vuex.mapGetters(['RouterLoadComplete'])
} // end AuthenticatePassword


export { NotFound }
