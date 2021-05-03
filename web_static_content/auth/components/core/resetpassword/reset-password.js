import { ResetPasswordTemplate } from "./reset-password-template.html.js";
import { app_name} from "../../../../global_variables.js";

const ResetPassword = {
    template: ResetPasswordTemplate,
    methods: {
        submitChange: async function (){
            // Set to the Change in State
            this.str_change_button_text = ' Changing Password';
            this.str_change_button_icon = 'fad fa-spinner-third fa-spin';
            this.bool_change_button_disabled = true;
            this.bool_password_disabled = true;
            this.bool_reset_code_disabled = true;
            // Start Reset attempt
            let bool_reset_password = await reset_password(this.str_reset_code, this.str_password_1);
            if (bool_reset_password){
                this.str_change_button_text = ' Redirecting...';
                this.str_change_button_icon = 'fad fa-spinner-third fa-spin';
                window.location.href = "/auth/#/login";
            }else{
                this.str_change_button_text = ' Change Password';
                this.str_change_button_icon = 'fas fa-key-skeleton';
                this.bool_change_button_disabled = false;
                this.bool_password_disabled = false;
                this.bool_reset_code_disabled = false;
            }
        }, // end submitLogin function
        getUrlParameter: function(variable) {
            let query = window.location.search.substring(1);
            let vars = query.split("&");
            for (let i=0;i<vars.length;i++) {
                let pair = vars[i].split("=");
                if(pair[0] === variable){return pair[1];}
            }
            return false;
        }
    }, //end methods
    data: function () {
        return {
            str_password_1: "", // Linked to username form field
            str_password_2: "", // Linked to password form field
            str_app_name: app_name, // Application Name From Global Variables
            str_change_button_text: "  Change Password", // Linked to the text on the Login button
            str_change_button_icon: "fas fa-key-skeleton", // Linked to the icon on the Login button
            bool_change_button_disabled: false, // Linked to disabled state of Login button
            bool_password_disabled: false, // Linked to the disabled state of the password form field
            str_reset_code: '',
            bool_reset_code_disabled: false,
        }; //end return
    }, // end data function
    mounted:function (){
        //this.get_url_params();
        let resetCode = this.getUrlParameter('resetCode');
        if (resetCode.length === 50) {
            this.str_reset_code = resetCode;
            this.bool_reset_code_disabled = true;
        }
    }
} // end AuthenticatePassword


export { ResetPassword }


async function reset_password(str_reset_code, str_password) {
    // Set initial Auth result to false
    let bool_reset_result = false;
    // Post to API
    await axios.post('/api/core_authentication/reset_password', {
        str_reset_code: str_reset_code,
        str_password: str_password
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
             if (data.bool_error){  // Error result from server
                 sweetAlert.fire({
                     title: 'Password Reset Failed',
                     html: 'There was an error resetting your password<br>' + response.data.str_error_text,
                     icon: 'error'
                 })
             }else{  // No error result from server
                 bool_reset_result = true;
                 if (data.bool_password_reset){  // Password reset success
                     sweetAlert.mixin({
                         toast: true,
                         position: 'top-end',
                         showConfirmButton: false,
                         timer: 30000,
                         timerProgressBar: false,
                     }).fire({
                         icon: 'success',
                         title: 'Password reset successful\n Redirecting...'
                     })
                 }else{  // Unknown error resetting password
                     sweetAlert.fire({
                         title: 'Password Reset Failed',
                         html: 'There was an error resetting your password<br>' + response.data.str_error_text,
                         icon: 'error'
                     })
                 }
             }
        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Password Reset Failed',
                html: 'There was an error resetting your password<br>' + error,
                icon: 'error'
            })
        });
    return bool_reset_result; // Return the reset result
} // end authenticate function
