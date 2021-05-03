import { UserPositionTemplate } from "./user-position-template.html.js";

const UserPosition = {
    template: UserPositionTemplate,
    mounted:function () {
       // Functions and Commands they get run when loaded
       this.get_position_listing();
    },
    props: {
        parentData: {
            type: Object,
            required: true
        }
    },
    watch: {
        'parentData.reload_data': function(newVal, oldVal) { // watch it
            if(newVal){
                this.parentData.reload_data = false;
                this.get_position_listing();
            }
        }
    },
    data: function () {
        return {
            // Shared variables and variables that will be in HTML
            arr_position: [],
            bool_loading_user_position: false,
            str_id_position_selected: '!',
        }
    },
    computed: {
        bool_no_position_selected() {
            if (this.str_id_position_selected == '!' || this.str_id_position_selected == ''){
                console.log("Disable");
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        // Functions that can be access via this.FunctionName() or via HTML
        get_position_listing: async function () {
            // console.log("here:");
            this.arr_position = [];
            this.bool_loading_user_position = true;
            await sleep(1000)
            // Start authentication attempt
            this.arr_position = await get_user_position_listing();
            // console.log( this.arr_position)
            this.bool_loading_user_position = false;
            await sleep(50)
            $('.js-example-basic-single').select2().on("select2:select", e => {
                const event = new Event("change", { bubbles: true, cancelable: true });
                e.params.data.element.parentElement.dispatchEvent(event);
            })
                .on("select2:unselect", e => {
                    const event = new Event("change", { bubbles: true, cancelable: true });
                    e.params.data.element.parentElement.dispatchEvent(event);
                });
        }, // end get_position_listing
    } // end methods
} // end UserPosition


export { UserPosition }

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function get_user_position_listing() {
    // Set arr_user to empty
    let arr_position = [];
    // GET to API
    await axios.get('/api/core_user_management/user_position__get_position_listing', {
    })
        .then(function (response) { // Non error result in axios
            let data = response.data;
            console.log(data);
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
                title: 'Error Loading User Position List',
                html: 'There was an error loading users<br>' + error,
                icon: 'error'
            })
            return false;
        });
        return arr_position;
} // end get_user_position_listing function

async function aNa_Failed(obj_ana){
    if (!obj_ana.bool_session_valid){
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
    if (!obj_ana.bool_permissions_valid){
        sweetAlert.fire({
            title: 'Permission Denied',
            html: 'You do not have permission to preform the rewuested action',
            icon: 'warning'
        })
    }
} // END aNa_Failed