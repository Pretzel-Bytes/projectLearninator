import { HeaderTemplate } from "./header-template.html.js";
import {app_name, app_sub_name} from "../../../../global_variables.js";

const Header = {
    template: HeaderTemplate,
    mounted:function () {

    },
    data: function () {
        return {
            str_app_name: app_name, // Application Name From Global Variables
            str_app_subname: app_sub_name, // Application Sub Name From Global Variables
        }
    }
} // end AuthenticatePassword


export { Header }

