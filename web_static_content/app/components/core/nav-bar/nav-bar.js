import { NavBarTemplate } from "./nav-bar-template.html.js";
import {app_name, app_sub_name, str_global_user_first_name, str_global_user_last_name, str_global_username} from "../../../../global_variables.js";

const NavBar = {
    template: NavBarTemplate,
    data: function () {
        return {
            str_app_name: app_name, // Application Name From Global Variables
            str_app_subname: app_sub_name, // Application Sub Name From Global Variables
            str_global_user_first_name,
            str_global_user_last_name,
            arr_navigation_with_child: [],
            arr_navigation_without_child: []
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.path;
        }
    },
    mounted: async function() {
        await this.start_get_navigation();
    },
    methods: {
        start_get_navigation: async function () {
            const obj_navs_to_add = await get_navigation()
            if (!obj_navs_to_add['bool_error']) {
                this.arr_navigation_with_child = obj_navs_to_add.arr_children;
                this.arr_navigation_without_child = obj_navs_to_add.arr_no_children;
            }
            await new Promise(r => setTimeout(r, 500));
            console.log('load')
            await dynamicallyLoadScript("../../../assets/js/smartadmin/app.bundle.js");
            console.log('loaded')
            await new Promise(r => setTimeout(r, 500));
            /**
             * detect desktop or mobile
             **/
            initApp.addDeviceType();

            /**
             * detect Webkit Browser
             **/
            initApp.detectBrowserType();

            /**
             * a. check for mobile view width and add class .mobile-view-activated
             **/
            initApp.mobileCheckActivation();

            /**
             * b. build navigation
             **/
            initApp.buildNavigation(myapp_config.navHooks);

            /**
             * c. initialize nav filter
             **/
            initApp.listFilter(myapp_config.navHooks, myapp_config.navFilterInput, myapp_config.navAnchor);

            /**
             * d. run DOM misc functions
             **/
            initApp.domReadyMisc();

            /**
             * e. run app forms class detectors [parentClass,focusClass,disabledClass]
             **/
            initApp.appForms('.input-group', 'has-length', 'has-disabled');
        } // end start_get_navigation function
    }
} // end AuthenticatePassword


export { NavBar }

async function dynamicallyLoadScript(url) {
    let script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    await document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

async function get_navigation(){
    let obj_return = {bool_error: false, arr_no_children: [], arr_children: []}
    await axios.get('/api/core_routes_and_navigation/get_navigation', {})
        .then(function (response) { // Non error result in axios
            let data = response.data;
            console.log(data);
            if (data['bool_error']){
                obj_return.bool_error = true;
            }else{
                obj_return.arr_no_children = data['arr_no_children'];
                obj_return.arr_children = data['arr_children'];
            }
        })
        .catch(function (error) { // Error result in axios
            console.log(error)
            obj_return.bool_error = true;
            return obj_return;
        });
    return obj_return
} // end get_navigation function

