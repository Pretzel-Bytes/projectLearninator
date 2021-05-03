import { AddEditUserTemplate } from "./add-edit-user-template.html.js";

const AddEditUser = {
    template: AddEditUserTemplate,
    mounted: async function () {
        $('#addUserModal').modal({
            backdrop: 'static',
            keyboard: true
        });
        $('#addUserModal').on('hidden.bs.modal', this.close);
        if (this.$route.params.id !== undefined) {
            this.bool_edit_user = true;
            this.str_form_title = 'Edit a User';
            this.str_add_edit_button_text = 'Loading User';
            this.str_add_edit_button_icon = 'fas fa-spinner fa-spin';
            this.bool_add_edit_button_disabled = true;
            this.str_loading_text = 'Loading User';
            await this.load_user();
            this.str_loading_text = 'Loading Form';
        }
        await this.load_listing();
    },
    data: function () {
        return {
            bool_edit_user: false,
            str_form_title: 'Add a User',
            str_add_edit_button_text: 'Add User',
            str_add_edit_button_icon: 'fas fa-plus',
            bool_add_edit_button_disabled: false,
            bool_form_loading: true,
            str_new_user_first_name: '',
            str_new_user_last_name: '',
            str_new_user_username: '',
            str_new_user_username_generated: '',
            str_new_user_password:'',
            bool_new_user_account_enabled: true,
            bool_new_user_password_change: true,
            arr_suffix: [],
            arr_prefix: [],
            arr_position: [],
            str_suffix_id: '',
            str_prefix_id: '',
            str_position_id: '',
            str_password_type: 'password',
            str_show_hide_password_icon: 'fas fa-eye',
            str_show_hide_password_text: 'Show Password',
            arr_password: [],
            obj_status:{"name": "AddUser", "changed": false},
            str_loading_text: 'Loading Form'
        }
    },
    watch: {
        'str_new_user_password': function(val, preVal){
            let letters = val.split("");
            $('.password_color').each(function(){
                //var letters = this.str_new_user_password;
                $(this).text('');
                for(var i = 0; i < letters.length; i++){
                    if (/^[a-z]+$/.test(letters[i])) {
                        $(this).append('<b><span style="color: red; font-size: large; background-color: white">' + letters[i] + '</span></b>');
                    }else if (/^[A-Z]+$/.test(letters[i])) {
                        $(this).append('<b><span style="color: green; font-size: large; background-color: white">' + letters[i] + '</span></b>');
                    }else if (/^[0-9]+$/.test(letters[i])) {
                        $(this).append('<b><span style="color: purple; font-size: large; background-color: white">' + letters[i] + '</span></b>');
                    }else if (/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.@#()\/]/.test(letters[i])) {
                        $(this).append('<b><span style="color: black; font-size: large; background-color: white">' + letters[i] + '</span></b>');
                    }else if (/[ ]/.test(letters[i])) {
                        $(this).append('<b><span style="color: gold; font-size: large; background-color: white">[SPACE]</span></b>');
                    }else{
                        $(this).append('<b><span style="color: tomato; font-size: large; background-color: white">' + letters[i] + '</span></b>');
                    }
                }
            });
        }
    },
    methods: {
        close() {
            $('#addUserModal').modal('hide');
            this.$emit('data', this.obj_status);
            this.$router.push(this.$route.meta['parent'])
        },
        generatePassword: function (){
            let length = (16)?(16):(10);
            let string = "abcdefghijklmnopqrstuvwxyz"; //to upper
            let numeric = '0123456789';
            let punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
            let password = "";
            let character = "";
            let crunch = true;
            while( password.length<length ) {
                let entity1 = Math.ceil(string.length * Math.random()*Math.random());
                let entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
                let entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
                let hold = string.charAt( entity1 );
                hold = (password.length%2==0)?(hold.toUpperCase()):(hold);
                character += hold;
                character += numeric.charAt( entity2 );
                character += punctuation.charAt( entity3 );
                password = character;
            }
            password=password.split('').sort(function(){return 0.5-Math.random()}).join('');
            this.str_new_user_password = password;
            this.show_hide_password(true);
        },
        add_user: async function (){
            // Post to API
            this.str_add_edit_button_text = 'Adding User';
            this.str_add_edit_button_icon = 'fas fa-spinner fa-spin';
            this.bool_add_edit_button_disabled = true;
            let bool_added = false;
            await axios.post('/api/core_user_management/create_user', {
                str_username: this.str_new_user_username,
                str_password: this.str_new_user_password,
                str_firstName: this.str_new_user_first_name,
                str_lastName: this.str_new_user_last_name,
                bool_enabled: this.bool_new_user_account_enabled,
                bool_passwordChange: this.bool_new_user_password_change,
                str_prefix: this.str_prefix_id || 'NULL',
                str_suffix: this.str_suffix_id || 'NULL',
                str_position: this.str_position_id || 'NULL'
            })
                .then(function (response) { // Non error result in axios
                    let data = response.data;
                    console.log(data);
                    let result_data = data['result_data'];
                    if (!data['aNa']['bool_valid']){aNa_Failed(data['aNa']);};
                    if (data['bool_error'] || data['result_data']['bool_error']){
                        sweetAlert.fire({
                            title: 'Error Adding User',
                            html: 'There was an error Adding user<br>' + data['str_error_text'] + data['result_data']['str_error_text'],
                            icon: 'error'
                        })
                        return;
                    }
                    if (result_data['bool_error']){
                        sweetAlert.fire({
                            title: 'Add User Failed',
                            html: 'There was an error adding user<br>' + result_data['str_error_text'],
                            icon: 'error'
                        })
                        return;
                    }
                    if (!result_data['bool_first_name_valid'] || !result_data['bool_last_name_valid'] || result_data['bool_user_exists']){
                        sweetAlert.fire({
                            title: 'Add User Failed',
                            html: 'User Addition Report<br>' +
                                'First Name Valid: <b>' + result_data['bool_first_name_valid'] + '</b><br>' +
                                'Last Name Valid: <b>' + result_data['bool_last_name_valid'] + '</b><br>' +
                                'Password Valid: <b>' + true + '</b><br>' +
                                'Username Exists: <b>' + result_data['bool_user_exists'] + '</b><br>',
                            icon: 'warning'
                        })
                        return;
                    }
                    bool_added = true;
                })
                .catch(function (error) { // Error result in axios
                    sweetAlert.fire({
                        title: 'Add User Failed',
                        html: 'There was an error adding user<br>' + error,
                        icon: 'error'
                    })
                    return false;
                });
            if (bool_added) {
                await sleep(1000);
                this.obj_status['changed'] = true;
                this.close()
            }else{
                this.str_add_edit_button_text = 'Add User';
                this.str_add_edit_button_icon = 'fas fa-plus';
                this.bool_add_edit_button_disabled = false;
            }
        },
        first_name_blur: function (e){
            if ((this.str_new_user_username === this.str_new_user_username_generated) && (this.str_new_user_first_name !== '' && this.str_new_user_last_name !== '')){
                let str_username = this.str_new_user_first_name.toLowerCase() + "." + this.str_new_user_last_name.toLowerCase()
                str_username = str_username.split(" ").join("");
                this.str_new_user_username_generated = str_username;
                this.str_new_user_username = str_username;
            }

        },
        sur_name_blur: function (e) {
            if ((this.str_new_user_username === this.str_new_user_username_generated) && (this.str_new_user_first_name !== '' && this.str_new_user_last_name !== '')){
                let str_username = this.str_new_user_first_name.toLowerCase() + "." + this.str_new_user_last_name.toLowerCase()
                str_username = str_username.split(" ").join("");
                this.str_new_user_username_generated = str_username;
                this.str_new_user_username = str_username;
            }
        },
        show_hide_password: async function (booL_generate=false){
            if (this.str_password_type === 'password' || booL_generate){
                this.str_password_type = 'text';
                this.str_show_hide_password_icon = 'fas fa-eye-slash';
                this.str_show_hide_password_text = 'Hide Password';
                //this.arr_password
            }else{
                this.str_password_type = 'password';
                this.str_show_hide_password_icon = 'fas fa-eye';
                this.str_show_hide_password_text = 'Show Password';
            }
        },
        load_listing: async function(){
            const [arr_suffix, arr_prefix, arr_position] = await Promise.all([
                get_user_suffix_listing(),
                get_user_prefix_listing(),
                get_user_position_listing()
            ]);
            arr_prefix.unshift({id: '', text: 'None Selected'});
            arr_position.unshift({id: '', text: 'None Selected'});
            arr_suffix.unshift({id: '', text: 'None Selected'});
            this.arr_prefix = arr_prefix;
            this.arr_position = arr_position;
            this.arr_suffix = arr_suffix;
            this.bool_form_loading = false;
            await sleep(10);
            $('.js-example-basic-single-prefix').select2({
                dropdownParent: $('#addUserModal')
            }).on("select2:select", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            }).on("select2:unselect", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            });
            $('.js-example-basic-single-suffix').select2({
                dropdownParent: $('#addUserModal')
            }).on("select2:select", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            }).on("select2:unselect", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            });
            $('.js-example-basic-single-position').select2({
                dropdownParent: $('#addUserModal')
            }).on("select2:select", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            }).on("select2:unselect", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            });

        },
        load_user: async function(){
            let axios_data = { bool_error: false, data: {}};
            await axios.put('/api/core_user_management/get_single_user', {
                str_user_id: this.$route.params.id
            })
                .then(function (response) { // Non error result in axios
                    axios_data['data'] = response;
                })
                .catch(function (error) { // Error result in axios
                    sweetAlert.fire({
                        title: 'Get User Failed',
                        html: 'There was an error loading the user<br>' + error,
                        icon: 'error'
                    })
                    axios_data['bool_error'] = true;
                });
            if (! axios_data['bool_error']){
                let axios_result = axios_data['data'];
                if (axios_result['status'] === 200){
                    console.log(axios_result);
                    let data = axios_result['data'];
                    if (!data['bool_error']){
                        if (await check_AnA(data['aNa'])){
                            let result_data = data['result_data'];
                            if (!result_data['bool_error']){
                                let user_info = result_data['arr_user_info']
                                this.str_new_user_first_name = user_info['first_name'];
                                this.str_new_user_last_name = user_info['sur_name'];
                                this.str_new_user_username = user_info['user_name'];
                                this.str_new_user_username_generated = user_info['user_name'];
                                if (user_info['id_prefix'] === null){
                                    this.str_prefix_id = '';
                                }else {
                                    this.str_prefix_id = user_info['id_prefix'];
                                }
                                if (user_info['id_suffix'] === null){
                                    this.str_suffix_id = '';
                                }else {
                                    this.str_suffix_id = user_info['id_suffix'];
                                }
                                if (user_info['id_position'] === null){
                                    this.str_position_id = '';
                                }else {
                                    this.str_position_id = user_info['id_position'];
                                }
                                this.bool_new_user_account_enabled = user_info['bool_enabled'];
                                this.bool_new_user_password_change = user_info['bool_pass_change'];
                                this.str_add_edit_button_text = 'Save User';
                                this.str_add_edit_button_icon = 'fas fa-save';
                                this.bool_add_edit_button_disabled = false;
                            }else{
                                sweetAlert.fire({
                                    title: 'Get User Failed',
                                    html: 'Error loading user<br>' + result_data['str_error_text'],
                                    icon: 'error'
                                })
                            }
                        }
                    }else{
                        sweetAlert.fire({
                            title: 'Get User Failed',
                            html: data['str_error_text'],
                            icon: 'error'
                        })
                    }
                }else{
                    sweetAlert.fire({
                        title: 'Get User Failed',
                        html: 'Unhandled server side error, please try again.',
                        icon: 'error'
                    })
                }
            }
        },
        save_user: async function (){
// Post to API
            console.log('save');
            this.str_add_edit_button_text = 'Saving User';
            this.str_add_edit_button_icon = 'fas fa-spinner fa-spin';
            this.bool_add_edit_button_disabled = true;
            let bool_added = false;
            await axios.post('/api/core_user_management/save_user', {
                str_username: this.str_new_user_username,
                str_password: this.str_new_user_password || 'NULL',
                str_firstName: this.str_new_user_first_name,
                str_lastName: this.str_new_user_last_name,
                bool_enabled: this.bool_new_user_account_enabled,
                bool_passwordChange: this.bool_new_user_password_change,
                str_prefix: this.str_prefix_id || 'NULL',
                str_suffix: this.str_suffix_id || 'NULL',
                str_position: this.str_position_id || 'NULL',
                id_user: this.$route.params.id
            })
                .then(function (response) { // Non error result in axios
                    let data = response.data;
                    console.log(data);
                    let result_data = data['result_data'];
                    if (!data['aNa']['bool_valid']){aNa_Failed(data['aNa']);};
                    if (data['bool_error'] || data['result_data']['bool_error']){
                        sweetAlert.fire({
                            title: 'Error Saving User',
                            html: 'There was an error Saving user<br>' + data['str_error_text'] + data['result_data']['str_error_text'],
                            icon: 'error'
                        })
                        return;
                    }
                    if (result_data['bool_error']){
                        sweetAlert.fire({
                            title: 'Save User Failed',
                            html: 'There was an error saving user<br>' + result_data['str_error_text'],
                            icon: 'error'
                        })
                        return;
                    }
                    if (!result_data['bool_first_name_valid'] || !result_data['bool_last_name_valid'] || result_data['bool_user_exists']){
                        sweetAlert.fire({
                            title: 'Save User Failed',
                            html: 'User Addition Report<br>' +
                                'First Name Valid: <b>' + result_data['bool_first_name_valid'] + '</b><br>' +
                                'Last Name Valid: <b>' + result_data['bool_last_name_valid'] + '</b><br>' +
                                'Password Valid: <b>' + true + '</b><br>' +
                                'Username Exists: <b>' + result_data['bool_user_exists'] + '</b><br>',
                            icon: 'warning'
                        })
                        return;
                    }
                    bool_added = true;
                })
                .catch(function (error) { // Error result in axios
                    sweetAlert.fire({
                        title: 'Save User Failed',
                        html: 'There was an error adding user<br>' + error,
                        icon: 'error'
                    })
                    return false;
                });
            if (bool_added) {
                await sleep(1000);
                this.obj_status['changed'] = true;
                this.close()
            }else{
                this.str_add_edit_button_text = 'Save User';
                this.str_add_edit_button_icon = 'fas fa-save';
                this.bool_add_edit_button_disabled = false;
            }
        },
        form_submit: async function (){
            if (this.bool_edit_user){
                await this.save_user();
            }else{
                await this.add_user();
            }
        }
    } // end methods
} // end UserManagement


export { AddEditUser }


async function get_user_suffix_listing() {
    // Set arr_user to empty
    let arr_suffix = [];
    // GET to API
    await axios.get('/api/core_user_management/user_suffix__get_suffix_listing', {
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
            if (!data['aNa']['bool_valid']){aNa_Failed(data['aNa']);};
            if (data['bool_error'] || data['result_data']['bool_error']){
                sweetAlert.fire({
                    title: 'Error Loading Users',
                    html: 'There was an error loading users<br>' + data['str_error_text'] + data['result_data']['str_error_text'],
                    icon: 'error'
                })
            }
            arr_suffix = data['result_data']['arr_suffix'];

        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Error Loading User Suffix List',
                html: 'There was an error loading users<br>' + error,
                icon: 'error'
            })
            return false;
        });
    return arr_suffix;
} // end get_user_suffix_listing function

async function get_user_prefix_listing() {
    // Set arr_user to empty
    let arr_prefix = [];
    // GET to API
    await axios.get('/api/core_user_management/user_prefix__get_prefix_listing', {
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
            if (!data['aNa']['bool_valid']){aNa_Failed(data['aNa']);};
            if (data['bool_error'] || data['result_data']['bool_error']){
                sweetAlert.fire({
                    title: 'Error Loading Users',
                    html: 'There was an error loading users<br>' + data['str_error_text'] + data['result_data']['str_error_text'],
                    icon: 'error'
                })
            }
            arr_prefix = data['result_data']['arr_prefix'];

        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Error Loading User Suffix List',
                html: 'There was an error loading users<br>' + error,
                icon: 'error'
            })
            return false;
        });
    return arr_prefix;
} // end get_user_prefix_listing function

async function get_user_position_listing() {
    // Set arr_user to empty
    let arr_position = [];
    // GET to API
    await axios.get('/api/core_user_management/user_position__get_position_listing', {
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
            if (!data['aNa']['bool_valid']){aNa_Failed(data['aNa']);};
            if (data['bool_error'] || data['result_data']['bool_error']){
                sweetAlert.fire({
                    title: 'Error Loading Users',
                    html: 'There was an error loading users<br>' + data['str_error_text'] + data['result_data']['str_error_text'],
                    icon: 'error'
                })
            }
            arr_position = data['result_data']['arr_position'];

        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Error Loading User Suffix List',
                html: 'There was an error loading users<br>' + error,
                icon: 'error'
            })
            return false;
        });
    return arr_position;
} // end get_user_position_listing function

async function check_AnA(obj_ana){
    console.log(obj_ana);
    if (!obj_ana['bool_session_valid']){
        let timerInterval
        Swal.fire({
            title: 'Invalid User Session',
            html: 'Your session is invalid, you will be redirected to the login page.<b></b>',
            icon: "info",
            backdrop: false,
            confirmButtonText: 'Redirect Now',
            timer: 10000,
            timerProgressBar: true,
            willOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            onClose: () => {
                window.location = '/auth/';
            }
        })
    }
    if (!obj_ana['bool_permissions_valid']){
        sweetAlert.fire({
            title: 'Permission Denied',
            html: 'You do not have permission to preform the requested action',
            icon: 'warning'
        })
        return false;
    }
    return true;
} // END check_AnA

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}