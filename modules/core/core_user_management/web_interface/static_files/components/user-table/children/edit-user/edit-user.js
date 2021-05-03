import { EditUserTemplate } from "./edit-user-template.html.js";
import {app_name, app_sub_name} from "../../../../../../../../global_variables.js";

const EditUser = {
    template: EditUserTemplate,
    mounted:function () {
        $('#editUserModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        this.start_get_single_user();
    },
    data: function () {
        return {
            str_app_name: app_name, // Application Name From Global Variables
            str_app_subname: app_sub_name, // Application Sub Name From Global Variables
            bool_loading_data: true,
            str_orig_first_name: "",
            str_orig_last_name: "",
            str_orig_username: "",
            str_first_name: "",
            str_last_name: "",
            str_username: "",
            obj_status:{"name": "EditUsers", "changed": true}
        }
    },
    methods: {
        close () {
            $('#editUserModal').modal('hide');
            this.$emit('data', this.obj_status);
            this.$router.push(this.$route.meta['parent'])
        },
        start_get_single_user: async function(){
            let str_user_id = this.$route.params.id;
            let obj_get_single_user = await get_single_user(str_user_id);
            if (obj_get_single_user.bool_user_found === false){
                $('#editUserModal').modal('hide');
                this.$router.push(this.$route.meta['parent'])
            }else{
                this.str_first_name = obj_get_single_user.str_first_name;
                this.str_last_name = obj_get_single_user.str_last_name;
                this.str_username = obj_get_single_user.str_user_name;
                this.str_orig_first_name = this.str_first_name;
                this.str_orig_last_name = this.str_last_name;
                this.str_orig_username = this.str_username;
                this.bool_loading_data = false;
            }
        }

    } // end methods
} // end UserManagement


export { EditUser }


async function get_single_user(str_user_id) {
    let obj_return = {
        "str_user_name": "",
        "str_first_name": "",
        "str_last_name": "",
        "bool_user_found": false
    }
    // Post to API
    await axios.put('/api/core_user_management/get_single_user', {
        str_user_id: str_user_id
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
            if (data.bool_error === true) { // Server side error
                sweetAlert.fire({
                    title: 'Get User Failed',
                    html: 'There was an error adding user<br>' + response.data.str_error_text,
                    icon: 'error'
                })
                return obj_return;
            } // End Server Side Error Check
            if (data.arr_permission_check.bool_session_valid === false) { // Invalid Session
                sweetAlert.fire({
                    title: 'Get User Failed',
                    html: 'You do not have a valid user session. You need to re authenticate',
                    icon: 'warning'
                })
                return obj_return;
            } // End Invalid Session
            if (data.arr_permission_check.bool_user_has_permission === false) { // No Permissions
                sweetAlert.fire({
                    title: 'Get User Failed',
                    html: 'You do not have permission to preform this action',
                    icon: 'warning'
                })
                return obj_return;
            } // End No Permissions
            if (data.arr_user_data.bool_user_found === false) { // User Not Created
                sweetAlert.fire({
                    title: 'Get User Failed',
                    html: 'No User Found',
                    icon: 'error'
                })
                return obj_return;
            } // End User Not Created
            let user_data = data.arr_user_data;
            obj_return.bool_user_found = true;
            obj_return.str_first_name = user_data.first_name;
            obj_return.str_last_name = user_data.sur_name;
            obj_return.str_user_name = user_data.user_name;
            return obj_return;
        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Get User Failed',
                html: 'There was an error adding user<br>' + error,
                icon: 'error'
            })
            return obj_return;
        });
    return obj_return;
} // end add_user function

