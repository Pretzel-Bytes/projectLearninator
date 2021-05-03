import { ResetPasswordTemplate } from "./reset-password-template.html.js";

const ResetPassword = {
    template: ResetPasswordTemplate,
    mounted:function () {
        $('#resetPasswordModal').modal({
            backdrop: 'static',
            keyboard: true
        });
        $('#resetPasswordModal').on('hidden.bs.modal', this.close);
        if (this.$route.params.id === undefined) {
            this.close();
        }
        this.str_username = this.$route.params.name;
    },
    data: function () {
        return {
            str_new_password: '',
            str_username: '',
            bool_require_passowrd_change: true,
            str_password_type: 'password',
            str_show_hide_password_icon: 'fas fa-eye',
            str_show_hide_password_text: 'Show Password',
            arr_password: [],
            bool_require_password_change: true,
            obj_status:{"name": "ResetPassword", "changed": false},
        }
    },
    watch: {
        'str_new_password': function(val, preVal){
            let letters = val.split("");
            $('.password_color').each(function(){
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
        close () {
            $('#resetPasswordModal').modal('hide');
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
            this.str_new_password = password;
            this.show_hide_password(true);
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
        reset_request: async function(){

        }
    } // end methods
} // end UserManagement


export { ResetPassword }
