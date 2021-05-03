import {
    DeleteSuffixTemplate
} from "./delete-suffix-template.html.js";

const DeleteSuffix = {
    template: DeleteSuffixTemplate,
    mounted: function () {
        $('#suffixModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        this.str_suffix_id = this.$route.params.id;
        this.str_delete_suffix_button_text = "Loading Suffix";
        this.str_delete_suffix_button_class = "fas fa-spinner fa-spin";
        this.start_get_suffix();
    },
    data: function () {
        return {
            bool_add_suffix: false,
            obj_status: {
                "name": "DeleteSuffix",
                "changed": false
            },
            bool_suffix_deleted: false,
            bool_locking_action: false,
            str_delete_suffix_button_text: "Delete Suffix",
            str_delete_suffix_button_class: "fas fa-trash",
            str_delete_suffix_button_additional_text_1: '',
            str_delete_suffix_button_additional_text_2: '',
            str_suffix_id: '',
            str_suffix_text: '',
            interval: false,
            count: ''
        }
    },
    methods: {
        close: function () {
            $('#suffixModal').modal('hide');
            if (this.bool_suffix_deleted) {
                this.obj_status.changed = true;
            }
            this.$emit('data', this.obj_status);
            this.$router.push(this.$route.meta['parent'])
        },
        start_get_suffix: async function () {
            try {
                let obj_resut = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                this.bool_locking_action = true;
                await axios.post('/api/core_user_management/user_suffix__get_single_suffix', {
                    str_suffix: this.str_suffix_id
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
                        title: 'Error Loading Suffix',
                        html: obj_resut.str_error,
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (obj_resut.obj_axios_data['bool_error'] || obj_resut.obj_axios_data['result_data']['bool_error']) {
                    await sweetAlert.fire({
                        title: 'Error Loading Suffix',
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
                        title: 'Error Loading Suffix',
                        html: 'Suffix was not found on the server',
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                this.str_suffix_text = obj_resut.obj_axios_data['result_data']['str_suffix_text'];
                this.str_delete_suffix_button_additional_text_1 = ' (Hold For ';
                this.str_delete_suffix_button_additional_text_2 = ' Seconds)';
                this.count = 3;
                this.str_delete_suffix_button_text = "Delete Suffix";
                this.str_delete_suffix_button_class = "fas fa-trash";
                // this.bool_adding_suffix = false;
                // this.str_add_suffix_button_text = "Save Suffix";
                // this.str_add_suffix_button_class = "fas fa-save";
            } catch (error) {
                console.error(error);
                await sweetAlert.fire({
                    title: 'Error Loading Suffix',
                    html: error,
                    icon: 'error'
                });
                await sleep(10);
                this.close();
            }
            this.bool_locking_action = false;

        },
        delete_mouse_down: function () {
            if (!this.interval) {
                this.interval = setInterval(() => this.count--, 1000)
                this.delete_mouse_down_time();
            }

        },
        delete_mouse_up: function () {
            clearInterval(this.interval)
            this.interval = false
            this.count = 3;
        },
        delete_mouse_down_time: async function () {
            while (this.interval && this.count > 0) {
                if (this.count === 1) {
                    this.str_delete_suffix_button_additional_text_2 = ' Second)';
                }
                await sleep(1)
            }
            clearInterval(this.interval)
            this.interval = false
            this.count = 3;
            this.start_delete_suffix();
        },
        start_delete_suffix: async function () {
            this.bool_locking_action = true;
            this.str_delete_suffix_button_text = "Deleting Suffix";
            this.str_delete_suffix_button_class = "fas fa-spinner fa-spin";
            this.str_delete_suffix_button_additional_text_1 = '';
            this.str_delete_suffix_button_additional_text_2 = '';
            this.count = '';
            try {
                let obj_resut = {
                    bool_error: false,
                    str_error: '',
                    obj_axios_data: {}
                };
                this.bool_locking_action = true;
                await axios.post('/api/core_user_management/user_suffix__delete_suffix', {
                    str_id_suffix: this.str_suffix_id
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
                        title: 'Error Deleting Suffix',
                        html: obj_resut.str_error,
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (obj_resut.obj_axios_data['bool_error'] || obj_resut.obj_axios_data['result_data']['bool_error']) {
                    await sweetAlert.fire({
                        title: 'Error Deleting Suffix',
                        html: obj_resut.obj_axios_data['str_error_text'] + obj_resut.obj_axios_data['result_data']['str_error_text'],
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                if (!obj_resut.obj_axios_data['aNa']['bool_valid']) {
                    await aNa_Failed(obj_resut.obj_axios_data['aNa']);
                    await sleep(10);
                    this.close();
                }
                if (!obj_resut.obj_axios_data['result_data']['bool_deleted']) {
                    await sweetAlert.fire({
                        title: 'Error Deleting Suffix',
                        html: 'Unknown Error Deleting Suffix',
                        icon: 'error'
                    });
                    await sleep(10);
                    this.close();
                }
                this.bool_suffix_deleted = true;
                Toast.fire({icon: 'success', title:'Suffix Deleted', timer: 10000})
                this.close();
            } catch (error) {
                console.error(error);
                await sweetAlert.fire({
                    title: 'Error Loading Suffix',
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
    DeleteSuffix
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