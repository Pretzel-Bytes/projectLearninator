import { EnableDisableUserTemplate } from "./enable-disable-user-template.html.js";

const EnableDisableUser = {
    template: EnableDisableUserTemplate,
    mounted:function () {
        $('#editUserModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log(this.$route.params.id);
    },
    data: function () {
        return {
        }
    },
    methods: {
        close () {
            $('#editUserModal').modal('hide');
            this.$router.go(-1)
        }
    } // end methods
} // end UserManagement


export { EnableDisableUser }
