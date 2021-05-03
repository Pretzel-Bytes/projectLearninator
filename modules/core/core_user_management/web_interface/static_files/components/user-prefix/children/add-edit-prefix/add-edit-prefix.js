import {
    AddEditPrefixTemplate
} from "./add-edit-prefix-template.html.js";

const AddEditPrefix = {
    template: AddEditPrefixTemplate,
    mounted: function () {
        $('#prefixModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        if (this.$route.params.id === undefined) {
            this.bool_add_prefix = true;
            this.str_title_text = "Add User Prefix";
        } else if (this.$route.params.id === 'add') {
            this.bool_add_prefix = true;
            this.str_title_text = "Add User Prefix";
        } else {
            this.bool_add_prefix = false;
            this.str_title_text = "Edit User Prefix";
            this.str_edit_prefix_id = this.$route.params.id;
            this.bool_adding_prefix = true;
            this.str_add_prefix_button_text = "Loading Prefix";
            this.str_add_prefix_button_class = "fas fa-spinner fa-spin";
            this.start_get_prefix();
        }
        //console.log(this.$route.params.id);
    },
    data: function () {
        return {
            bool_add_prefix: false,
            str_title_text: "Add User Prefix",
            obj_status: {
                "name": "AddEditPrefix",
                "changed": false
            },
            bool_added_or_edited: false,
            arr_prefixes_added: [],
            str_add_prefix_name: '',
            bool_adding_prefix: false,
            str_add_prefix_button_text: "Add Prefix",
            str_add_prefix_button_class: "fas fa-plus",
            str_edit_prefix_id: '',
            str_edit_prefix_text_bind: '',
            str_edit_prefix_text_db: ''
        }
    },
    methods: {
        close: function () {
            $('#prefixModal').modal('hide');
            if (this.bool_added_or_edited) {
                this.obj_status.changed = true;
            }
            this.$emit('data', this.obj_status);
            this.$router.push(this.$route.meta['parent'])
        },
        start_add_prefix: async function () {
            try {
                let obj_result = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                this.bool_adding_prefix = true;
                this.str_add_prefix_button_text = "Adding Prefix"
                this.str_add_prefix_button_class = "fas fa-spinner fa-spin"
                await axios.post('/api/core_user_management/user_prefix__add_user_prefix', {
                    str_prefix: this.str_add_prefix_name
                })
                .then(function (response) { // Non error result in axios
                    obj_result.obj_axios_data = response.data;
                })
                .catch(function (error) { // Error result in axios
                    obj_result.bool_error = true;
                    obj_result.str_error = error;
                    sweetAlert.fire({
                        title: 'Add Prefix Failed',
                        html: 'There was an error adding prefix<br>' + error,
                        icon: 'error'
                    })
                });
            let data = obj_result.obj_axios_data;
            if (data['bool_error']){
                sweetAlert.fire({
                    title: 'Add Prefix Failed',
                    html: 'There was an error adding prefix<br>' + data['str_error_text'],
                    icon: 'error'
                })
                return;
            }
            if (data['result_data']['bool_error']){
                sweetAlert.fire({
                    title: 'Add Prefix Failed',
                    html: 'There was an error adding prefix<br>' + data['result_data']['str_error_text'],
                    icon: 'error'
                })
                return;
            }
            if (data['result_data']['bool_prefix_inserted']) {
                this.bool_added_or_edited = true;
                this.obj_status.changed = true;
                this.arr_prefixes_added.push(this.str_add_prefix_name);
                this.str_add_prefix_name = '';
            } else if (data['result_data']['bool_exists']) {
                this.bool_added_or_edited = true;
                this.arr_prefixes_added.push(this.str_add_prefix_name + "(Already Exists)");
                this.str_add_prefix_name = '';
            }
            this.bool_adding_prefix = false;
            this.str_add_prefix_button_text = "Add Prefix"
            this.str_add_prefix_button_class = "fas fa-plus"
            await sleep(10);
            this.$refs.prefix.focus();
        } catch (error) {
            console.error(error);
            await sweetAlert.fire({
                title: 'Error Adding Prefix',
                html: error,
                icon: 'error'
            });
        }

        },
        start_get_prefix: async function () {
            try {
                let obj_resut = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                await axios.post('/api/core_user_management/user_prefix__get_single_prefix', {
                        str_prefix: this.str_edit_prefix_id
                    })
                    .then(function (response) { // Non error result in axios
                        obj_resut.obj_axios_data = response.data;
                    })
                    .catch(function (error) { // Error result in axios
                        obj_resut.bool_error = true;
                        obj_resut.str_error = error;
                    })
                if (obj_resut.bool_error) {
                    await sweetAlert.fire({
                        title: 'Error Loading Prefix',
                        html: obj_resut.str_error,
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (obj_resut.obj_axios_data['bool_error'] || obj_resut.obj_axios_data['result_data']['bool_error']) {
                    await sweetAlert.fire({
                        title: 'Error Loading Prefix',
                        html: obj_resut.obj_axios_data['str_error_text'] + obj_resut.obj_axios_data['result_data']['str_error_text'],
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (!obj_resut.obj_axios_data['aNa']['bool_valid']) {
                    aNa_Failed(obj_resut.obj_axios_data['aNa']);
                    await sleep(10);
                    this.close();
                }
                if (!obj_resut.obj_axios_data['result_data']['bool_prefix_found']) {
                    await sweetAlert.fire({
                        title: 'Error Loading Prefix',
                        html: 'Prefix was not found on the server',
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                this.str_edit_prefix_text_bind = obj_resut.obj_axios_data['result_data']['str_prefix_text'];
                this.str_edit_prefix_text_db = obj_resut.obj_axios_data['result_data']['str_prefix_text'];
                this.bool_adding_prefix = false,
                    this.str_add_prefix_button_text = "Save Prefix",
                    this.str_add_prefix_button_class = "fas fa-save"
            } catch (error) {
                console.error(error);
                await sweetAlert.fire({
                    title: 'Error Loading Prefix',
                    html: error,
                    icon: 'error'
                });
                await sleep(10);
                this.close();
            }

        },
        start_change_prefix: async function () {
            try {
                let obj_resut = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                this.bool_adding_prefix = true;
                this.str_add_prefix_button_text = "Changing Prefix";
                this.str_add_prefix_button_class = "fas fa-spinner fa-spin";
                await axios.post('/api/core_user_management/user_prefix__change_prefix', {
                    str_id_prefix: this.str_edit_prefix_id,
                    str_prefix_text: this.str_edit_prefix_text_bind
                })
                .then(function (response) { // Non error result in axios
                    obj_resut.obj_axios_data = response.data;
                })
                .catch(function (error) { // Error result in axios
                    obj_resut.bool_error = true;
                    obj_resut.str_error = error;
                })
                if (obj_resut.bool_error) {
                    await sweetAlert.fire({
                        title: 'Error Saving Prefix',
                        html: obj_resut.str_error,
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (obj_resut.obj_axios_data['bool_error'] || obj_resut.obj_axios_data['result_data']['bool_error']) {
                    await sweetAlert.fire({
                        title: 'Error Saving Prefix',
                        html: obj_resut.obj_axios_data['str_error_text'] + obj_resut.obj_axios_data['result_data']['str_error_text'],
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (!obj_resut.obj_axios_data['aNa']['bool_valid']) {
                    aNa_Failed(obj_resut.obj_axios_data['aNa']);
                    await sleep(10);
                    this.close();
                }
                this.bool_adding_prefix = false;
                this.str_add_prefix_button_text = "Save Prefix";
                this.str_add_prefix_button_class = "fas fa-save";
                if (obj_resut.obj_axios_data['result_data']['bool_exists']){
                    Toast.fire({icon: 'warning', title:'Prefix "' + this.str_edit_prefix_text_bind  + '" already in use', timer: 10000})
                      return;
                }
                if (!obj_resut.obj_axios_data['result_data']['bool_changed']){
                    await sweetAlert.fire({
                        title: 'Error Saving Prefix',
                        html: 'Unknown Error Saving Prefix',
                        icon: 'error'
                    });
                }else{
                    Toast.fire({icon: 'success', title:'Prefix changed to "' + this.str_edit_prefix_text_bind  + '"', timer: 10000})
                    this.obj_status.changed = true;
                    this.close();
                }
            } catch (error) {
                console.error(error);
                await sweetAlert.fire({
                    title: 'Error Loading Prefix',
                    html: error,
                    icon: 'error'
                });
                await sleep(10);
                this.close();
            }

        }
    } // end methods
} // end UserManagement


export {
    AddEditPrefix
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function aNa_Failed(obj_ana) {
    if (!obj_ana.bool_session_valid) {
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
    if (!obj_ana.bool_permissions_valid) {
        sweetAlert.fire({
            title: 'Permission Denied',
            html: 'You do not have permission to preform the rewuested action',
            icon: 'warning'
        })
    }
} // END aNa_Failed

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })