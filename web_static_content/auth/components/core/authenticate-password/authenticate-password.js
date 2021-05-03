import { AuthenticatePasswordTemplate } from "./authenticate-password-template.html.js";
import { app_name} from "../../../../global_variables.js";

let int_failed_login_count = 0;
let arr_forgot_password = ['You Serious Clark?', 'Do you need a password reset?', 'Try harder', 'I get it, typing is hard'];

const AuthenticatePassword = {
    template: AuthenticatePasswordTemplate,
    mounted:function() {
        this.str_redirect_url = this.getUrlParameter('redirect');
    },
    methods: {
        submitLogin: async function (){
            // Set to the Logging in State
            this.str_login_button_text = 'Logging in';
            this.str_login_button_icon = 'fad fa-spinner-third fa-spin';
            this.bool_login_button_disabled = true;
            this.bool_username_disabled = true;
            this.bool_password_disabled = true;
            this.bool_remember_me_disabled = true
            // Start authentication attempt
            let auth = await authenticate(this.str_username, this.str_password, this.bool_rememberMe);
            if (auth.bool_valid_credentials){
                if (auth.bool_password_change){
                    // Auth was success, password reset needed. changing state
                    this.str_login_button_text = 'Redirecting...';
                    this.str_login_button_icon = 'fad fa-spinner-third fa-spin';
                    window.location.href = "/auth/?resetCode=" + auth.str_password_reset + "#/reset-password";
                }else {
                    // Auth was success, No password reset needed. changing state
                    this.str_login_button_text = 'Redirecting...';
                    this.str_login_button_icon = 'fad fa-spinner-third fa-spin';
                    if (this.str_redirect_url !== false){
                        window.location.href = atob(this.str_redirect_url);
                    }else{
                        window.location.href = "/app/";
                    }
                }
            }else{
                // Auth failed, reverting state
                this.str_login_button_text = 'Login';
                this.str_login_button_icon = 'fas fa-key';
                this.bool_login_button_disabled = false;
                this.bool_username_disabled = false;
                this.bool_password_disabled = false;
                this.bool_remember_me_disabled = false
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
            str_username: "testuser", // Linked to username form field
            str_password: "password", // Linked to password form field
            bool_rememberMe: false, // Linked to remember me check box
            str_app_name: app_name, // Application Name From Global Variables
            str_login_button_text: "  Login", // Linked to the text on the Login button
            str_login_button_icon: "fas fa-key", // Linked to the icon on the Login button
            bool_login_button_disabled: false, // Linked to disabled state of Login button
            bool_username_disabled: false, // Linked to the disabled state of the username form field
            bool_password_disabled: false, // Linked to the disabled state of the password form field
            bool_remember_me_disabled: false, // Linked to the disabled state of the remember me check box
            str_redirect_url: ''
        }; //end return
    } // end data function
} // end AuthenticatePassword


export { AuthenticatePassword }


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function authenticate(str_username, str_password, bool_remember_me) {
    // Set initial Auth result to false
    let str_auth_result = 'false';
    let timerInterval
    let obj_return ={
        bool_valid_credentials: false,
        bool_password_change: false,
        str_password_reset: ""
    }
    // Post to API
    await axios.post('/api/core_authentication/password_authentication', {
        str_username: str_username,
        str_password: str_password,
        bool_remember_me: bool_remember_me
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
            console.log(data);
            if (data.bool_error === false) { // No server side error
                if (data.bool_valid_credentials === false) { // Invalid Credentials
                    if (int_failed_login_count >= 2) { // Pointless fun
                        sweetAlert.fire({
                            title: 'Login Failed',
                            html: 'Invalid Username or Password<br>' +
                                arr_forgot_password[Math.floor(Math.random()*arr_forgot_password.length)],
                            icon: 'warning'
                        })
                    }else{
                        sweetAlert.fire({
                            title: 'Login Failed',
                            text: 'Invalid Username or Password',
                            icon: 'warning'
                        })
                    }
                } else { // Valid Credentials
                    if (data.bool_user_enabled === false) { // User account is disabled
                        sweetAlert.fire({
                            title: 'Login Failed',
                            text: 'User Account is Disabled',
                            icon: 'warning'
                        })
                    } else { // User account is enabled
                        obj_return.bool_valid_credentials = true  // Set true auth result
                        if (data.bool_password_reset === true) {
                            sweetAlert.fire({
                                title: 'Password Change',
                                html: 'Your account is set to require a password change<br>You will be ' +
                                    'redirected to the page in <b>10</b> seconds.',
                                icon: 'info',
                                onBeforeOpen: () => {
                                    timerInterval = setInterval(() => {
                                        const content = Swal.getContent()
                                        if (content) {
                                            const b = content.querySelector('b')
                                            if (b) {
                                                b.textContent = parseInt(Swal.getTimerLeft() / 1000)
                                            }
                                        }
                                    }, 1000)
                                },
                                timer: 10000,
                                timerProgressBar: true
                            })
                            obj_return.bool_password_change = true;
                            obj_return.str_password_reset = data.str_password_reset_code;
                        } else {
                            sweetAlert.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 30000,
                                timerProgressBar: false,
                            }).fire({
                                icon: 'success',
                                title: 'Signed in successfully\n Redirecting...'
                            })
                        }
                    }

                }
            } else { // Server side error
                sweetAlert.fire({
                    title: 'Login Failed',
                    html: 'There was an error logging in<br>' + response.data.str_error_text,
                    icon: 'error'
                })
            }
        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Login Failed',
                html: 'There was an error logging in<br>' + error,
                icon: 'error'
            })
        });
    if (!obj_return.bool_valid_credentials){
        int_failed_login_count += 1
    }
    if (obj_return.bool_password_change){
        await sleep(10000);
    }
    return obj_return; // Return the auth result
} // end authenticate function
