import { UserTableTemplate } from "./user-table-template.html.js";

const UserTable = {
    template: UserTableTemplate,
    mounted: async function () {
        await this.getUserListing();
    },
    props: {
        parentData: {
            type: Object,
            required: true
        }
    },
    data: function () {
        return {
            arr_users: [],
            bool_loading_user_list: false,
        }
    },
    watch: {
        'parentData.reload_data': function(newVal, oldVal) { // watch it
            if(newVal){
                this.parentData.reload_data = false;
                this.getUserListing();
            }
        }
    },
    methods: {
        getUserListing: async function () {
            this.bool_loading_user_list = true;
            // Start authentication attempt
            this.arr_users = await get_user_listing();
            this.bool_loading_user_list = false;
            //this.table_load_reload();

        }, // end getUserListing
        editUserStart: function (str_id_user){
            console.log(str_id_user);
        }, //end editUserStart
        disableEnableUser: function (str_id_user){
            console.log(str_id_user);
        }, // end disableEnableUser
        resetPassword: function (str_id_user){
            console.log(str_id_user);
        }, // end resetPassword
        test: function (){alert('test')},
        table_load_reload: function (){
            var columnDefs = [
                {headerName: "Make", field: "make"},
                {headerName: "Model", field: "model"},
                {headerName: "Price", field: "price"}
            ];

            // let the grid know which columns to use
            var gridOptions = {
                columnDefs: columnDefs,
                rowSelection: 'multiple'
            };


            // lookup the container we want the Grid to use
            var eGridDiv = document.querySelector('#myGrid');

            // create the grid passing in the div to use together with the columns & data we want to use
            new agGrid.Grid(eGridDiv, gridOptions);
            gridOptions.api.setDomLayout('autoHeight');
            agGrid.
            agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json'}).then(function(data) {
                gridOptions.api.setRowData(data);
            });

            // console.log(this.arr_users);
            // let table = $('#table2').DataTable( {
            //     data: this.arr_users,
            //     dom: 'Bfrtip',
            //     select: true,
            //     buttons:[
            //         {
            //             text: 'My button',
            //             action: function ( e, dt, node, config ) {
            //                 alert( 'Button activated' );
            //             }
            //         }
            //     ],
            //     columns: [
            //         {data: 'id_user', visible: false, searchable: false},
            //         {"targets": -1, "data": null, "defaultContent": "<a class='editUser'>Edit</a>&nbsp;" +
            //                 "<a class='enableDisable'>ED</a>&nbsp;" +
            //                 "<a class='resetPassword'>ED</a>"},
            //         {data: 'prefix', defaultContent: ""},
            //         {data: 'first_name', defaultContent: "<b>Information Missing</b>"},
            //         {data: 'sur_name', defaultContent: "<b>Information Missing</b>"},
            //         {data: 'suffix', defaultContent: ""},
            //         {data: 'position', defaultContent: ""},
            //         {data: 'user_name', defaultContent: "<b>Information Missing</b>"},
            //         {data: '8', defaultContent: "<i>dsa</i>"}
            //     ]
            // } );
            // $('#table2 tbody').on( 'click', '.editUser', function () {
            //     let data = table.row( $(this).parents('tr') ).data();
            //     console.log( 'Edit:' + data['id_user'] );
            // }).on( 'click', '.enableDisable', function () {
            //     let data = table.row( $(this).parents('tr') ).data();
            //     console.log( 'Disable:' + data['id_user'] );
            // }).on( 'click', '.resetPassword', function () {
            //     let data = table.row( $(this).parents('tr') ).data();
            //     console.log( 'Reset:' + data['id_user'] );
            // });
            // if (typeof jQuery != 'undefined') {
            //     // jQuery is loaded => print the version
            //     alert(jQuery.fn.jquery);
            // }
        }
    }, // end methods
    onEnlargeText: function () {
        this.getUserListing();
    }
} // end UserManagement


export { UserTable }

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function get_user_listing() {
    let arr_users = [];
    // GET to API
    await axios.get('/api/core_user_management/get_user_listing', {
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
            arr_users = data['result_data']['arr_users'];
            response = null;
        })
        .catch(function (error) { // Error result in axios
            sweetAlert.fire({
                title: 'Error Loading Users',
                html: 'There was an error loading users<br>' + error,
                icon: 'error'
            })
        });

    return arr_users;
} // end get_user_listing function


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


async function testTable(){

    // let filtersConfig = {
    //     base_path: '../assets/vendor/tablefilter/',
    //     col_0: 'None',
    //     col_1: 'select',
    //     col_2: '',
    //     col_3: '',
    //     col_4: 'select',
    //     col_5: 'select',
    //     col_6: '',
    //     col_7: 'select',
    //     rows_counter: true,
    //     btn_reset: true,
    //     status_bar: false,
    //     col_types: [
    //         'string', 'string', 'string',
    //         'string', 'string', 'string',
    //         'string', 'string'
    //     ],
    //     extensions:[{ name: 'sort' }]
    // };
    //
    // await sleep(10);
    // let tf = new TableFilter('myTable', filtersConfig);
    // tf.init();
}
