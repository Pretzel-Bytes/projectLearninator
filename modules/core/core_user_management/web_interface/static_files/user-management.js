import { UserManagementTemplate } from "./user-management-template.html.js";
import {app_name, app_sub_name} from "../../../../global_variables.js";
import {UserTable} from "./components/user-table/user-table.js";
import { UserPrefix } from "./components/user-prefix/user-prefix.js"
import { UserSuffix } from "./components/user-suffix/user-suffix.js"
import { UserPosition } from "./components/user-position/user-position.js"

const UserManagement = {
    components: {
        'userTable': UserTable,
        'UserPrefix': UserPrefix,
        'UserSuffix': UserSuffix,
        'UserPosition': UserPosition
    },
    template: UserManagementTemplate,
    mounted:function () {
    },
    data: function () {
        return {
            str_app_name: app_name, // Application Name From Global Variables
            str_app_subname: app_sub_name, // Application Sub Name From Global Variables
            arr_users: [],
            bool_loading_user_list: false,
            obj_data_for_user_Table: {'reload_data': false},
            obj_data_for_user_prefix: {'reload_data': false},
            obj_data_for_user_suffix: {'reload_data': false},
            obj_data_for_user_position: {'reload_data': false}

        }
    },
    methods: {
        onData(data) {
            if (data !== undefined) {
                if (data.name === 'EditUsers') {
                    this.obj_data_for_user_Table.reload_data = data.changed;
                } else if (data.name === 'AddEditPrefix' || data.name === 'DeletePrefix') {
                    this.obj_data_for_user_prefix.reload_data = data.changed;
                } else if (data.name === 'AddEditSuffix' || data.name === 'DeleteSuffix') {
                    this.obj_data_for_user_suffix.reload_data = data.changed;
                } else if (data.name === 'AddEditPosition' || data.name === 'DeletePosition') {
                    this.obj_data_for_user_position.reload_data = data.changed;
                } else if (data.name === 'AddUser' || data.name === 'EditUser') {
                    this.obj_data_for_user_Table.reload_data = data.changed;
                }
            }
        }
    }, // end methods
    computed: {
        currentRouteName() {
            return this.$route.path;
        }
    }
} // end UserManagement


export { UserManagement }

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}



