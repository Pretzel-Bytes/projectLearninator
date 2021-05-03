import {
    AddEditSuffixTemplate
} from "./add-edit-suffix-template.html.js";

const AddEditSuffix = {
    template: AddEditSuffixTemplate,
    mounted: function () {
        $('#suffixModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        if (this.$route.params.id === undefined) {
            this.bool_add_suffix = true;
            this.str_title_text = "Add User Suffix";
        } else if (this.$route.params.id === 'add') {
            this.bool_add_suffix = true;
            this.str_title_text = "Add User Suffix";
        } else {
            this.bool_add_suffix = false;
            this.str_title_text = "Edit User Suffix";
            this.str_edit_suffix_id = this.$route.params.id;
            this.bool_adding_suffix = true;
            this.str_add_suffix_button_text = "Loading Suffix";
            this.str_add_suffix_button_class = "fas fa-spinner fa-spin";
            this.start_get_suffix();
        }
        //console.log(this.$route.params.id);
    },
    data: function () {
        return {
            bool_add_suffix: false,
            str_title_text: "Add User Suffix",
            obj_status: {
                "name": "AddEditSuffix",
                "changed": false
            },
            bool_added_or_edited: false,
            arr_suffixes_added: [],
            str_add_suffix_name: '',
            bool_adding_suffix: false,
            str_add_suffix_button_text: "Add Suffix",
            str_add_suffix_button_class: "fas fa-plus",
            str_edit_suffix_id: '',
            str_edit_suffix_text_bind: '',
            str_edit_suffix_text_db: ''
        }
    },
    methods: {
        close: function () {
            $('#suffixModal').modal('hide');
            if (this.bool_added_or_edited) {
                this.obj_status.changed = true;
            }
            this.$emit('data', this.obj_status);
            this.$router.push(this.$route.meta['parent'])
        },
        start_add_suffix: async function () {
            try {
                let obj_result = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                this.bool_adding_suffix = true;
                this.str_add_suffix_button_text = "Adding Suffix"
                this.str_add_suffix_button_class = "fas fa-spinner fa-spin"
                await axios.post('/api/core_user_management/user_suffix__add_user_suffix', {
                    str_suffix: this.str_add_suffix_name
                })
                .then(function (response) { // Non error result in axios
                    obj_result.obj_axios_data = response.data;
                })
                .catch(function (error) { // Error result in axios
                    obj_result.bool_error = true;
                    obj_result.str_error = error;
                    sweetAlert.fire({
                        title: 'Add suffix Failed',
                        html: 'There was an error adding suffix<br>' + error,
                        icon: 'error'
                    })
                });
            let data = obj_result.obj_axios_data;
            console.log(data);
            if (data['bool_error']){
                sweetAlert.fire({
                    title: 'Add suffix Failed',
                    html: 'There was an error adding suffix<br>' + data['str_error_text'],
                    icon: 'error'
                })
                return;
            }
            if (!data['aNa']['bool_valid']){
                aNa_Failed(data['aNa']);
                await sleep(10);
                this.close();
                return;
            }
            if (data['result_data']['bool_error']){
                sweetAlert.fire({
                    title: 'Add suffix Failed',
                    html: 'There was an error adding suffix<br>' + data['result_data']['str_error_text'],
                    icon: 'error'
                })
                return;
           }
            if (data['result_data']['bool_suffix_inserted']) {
                this.bool_added_or_edited = true;
                this.obj_status.changed = true;
                this.arr_suffixes_added.push(this.str_add_suffix_name);
                this.str_add_suffix_name = '';
            } else if (data['result_data']['bool_exists']) {
                this.bool_added_or_edited = true;
                this.arr_suffixes_added.push(this.str_add_suffix_name + "(Already Exists)");
                this.str_add_suffix_name = '';
            }
            this.bool_adding_suffix = false;
            this.str_add_suffix_button_text = "Add suffix"
            this.str_add_suffix_button_class = "fas fa-plus"
            await sleep(10);
            this.$refs.suffix.focus();
        } catch (error) {
            console.error(error);
            await sweetAlert.fire({
                title: 'Error Adding suffix',
                html: error,
                icon: 'error'
            });
        }

        },
        start_get_suffix: async function () {
            try {
                let obj_resut = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                await axios.post('/api/core_user_management/user_suffix__get_single_suffix', {
                        str_suffix: this.str_edit_suffix_id
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
                        title: 'Error Loading suffix',
                        html: obj_resut.str_error,
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (obj_resut.obj_axios_data['bool_error'] || obj_resut.obj_axios_data['result_data']['bool_error']) {
                    await sweetAlert.fire({
                        title: 'Error Loading suffix',
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
                if (!obj_resut.obj_axios_data['result_data']['bool_suffix_found']) {
                    await sweetAlert.fire({
                        title: 'Error Loading suffix',
                        html: 'suffix was not found on the server',
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                this.str_edit_suffix_text_bind = obj_resut.obj_axios_data['result_data']['str_suffix_text'];
                this.str_edit_suffix_text_db = obj_resut.obj_axios_data['result_data']['str_suffix_text'];
                this.bool_adding_suffix = false;
                this.str_add_suffix_button_text = "Save suffix";
                this.str_add_suffix_button_class = "fas fa-save";
            } catch (error) {
                console.error(error);
                await sweetAlert.fire({
                    title: 'Error Loading suffix',
                    html: error,
                    icon: 'error'
                });
                await sleep(10);
                this.close();
            }

        },
        start_change_suffix: async function () {
            try {
                let obj_resut = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                this.bool_adding_suffix = true;
                this.str_add_suffix_button_text = "Changing suffix";
                this.str_add_suffix_button_class = "fas fa-spinner fa-spin";
                await axios.post('/api/core_user_management/user_suffix__change_suffix', {
                    str_id_suffix: this.str_edit_suffix_id,
                    str_suffix_text: this.str_edit_suffix_text_bind
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
                        title: 'Error Saving suffix',
                        html: obj_resut.str_error,
                        icon: 'error'
                    });
                    this.bool_adding_suffix = false;
                    this.str_add_suffix_button_text = "Save suffix";
                    this.str_add_suffix_button_class = "fas fa-save";
                    return;
                }
                if (obj_resut.obj_axios_data['bool_error'] || obj_resut.obj_axios_data['result_data']['bool_error']) {
                    await sweetAlert.fire({
                        title: 'Error Saving suffix',
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
                this.bool_adding_suffix = false;
                this.str_add_suffix_button_text = "Save suffix";
                this.str_add_suffix_button_class = "fas fa-save";
                if (obj_resut.obj_axios_data['result_data']['bool_exists']){
                    Toast.fire({icon: 'warning', title:'suffix "' + this.str_edit_suffix_text_bind  + '" already in use', timer: 10000})
                      return;
                }
                if (!obj_resut.obj_axios_data['result_data']['bool_changed']){
                    await sweetAlert.fire({
                        title: 'Error Saving suffix',
                        html: 'Unknown Error Saving suffix',
                        icon: 'error'
                    });
                }else{
                    Toast.fire({icon: 'success', title:'suffix changed to "' + this.str_edit_suffix_text_bind  + '"', timer: 10000})
                    this.obj_status.changed = true;
                    this.close();
                }
            } catch (error) {
                console.error(error);
                await sweetAlert.fire({
                    title: 'Error Loading suffix',
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
    AddEditSuffix
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function aNa_Failed(obj_ana) {
    if (!obj_ana['bool_session_valid']) {
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
    if (!obj_ana['bool_permissions_valid']) {
        sweetAlert.fire({
            title: 'Permission Denied',
            html: 'You do not have permission to preform the requested action',
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