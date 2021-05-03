const AddEditUserTemplate = `
<div>
    <div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="addUserModal" style="overflow: auto !important">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-white">
                        {{str_form_title}}
                    </h4>
                    <button type="button" class="close text-white" aria-label="Close" @click="close()">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="form_submit" autocomplete="off" v-if="!bool_form_loading">
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="form-label" for="firstname">First Name<sup style="color: red">*</sup></label>
                                <input type="text" id="firstname" class="form-control" placeholder="First Name"
                                       v-model="str_new_user_first_name" required v-on:blur="first_name_blur">
                                <span class="help-block">
                                User's First Name
                            </span>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-label" for="lastname">Last Name<sup style="color: red">*</sup></label>
                                <input type="text" id="lastname" class="form-control" placeholder="Last Name"
                                       v-model="str_new_user_last_name" required v-on:blur="sur_name_blur">
                                <span class="help-block">
                                User's Last Name
                            </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="form-label" for="username">Username<sup style="color: red">*</sup></label>
                                <input type="text" id="username" class="form-control" placeholder="username"
                                       v-model="str_new_user_username" required>
                                <span class="help-block">
                                Application username
                            </span>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-label" for="password">Password<sup style="color: red" v-if="!bool_edit_user">*</sup></label>
                                <input v-bind:type="str_password_type" id="password" class="form-control" placeholder="Password"
                                       v-model="str_new_user_password" v-bind:required="!bool_edit_user">
                                <span class="help-block">
                                User's Password
                            </span>
                                <br>
                                <a v-bind:class="str_show_hide_password_icon" href="javascript:void(0)" v-on:click="show_hide_password(false)"> {{str_show_hide_password_text}}</a>
                                <span v-show="str_password_type==='text'">
                                <span class="password_color"><span v-for="char in arr_password">{{char}}</span></span>
                            </span><br>
                                <a class="fas fa-sync" href="javascript:void(0)" v-on:click="generatePassword()"> Generate
                                    Password</a>

                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="form-label" for="user_prefix">User's Name Prefix</label>
                                <select class="js-example-basic-single-prefix" id="user_prefix" style="width: 100%" v-model="str_prefix_id">
                                    <option v-for="prefix in arr_prefix" v-bind:value="prefix.id">{{prefix.text}}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-label" for="user_suffix">User's Name Suffix</label>
                                <select class="js-example-basic-single-suffix" id="user_suffix" name="state" style="width: 100%"
                                        v-model="str_suffix_id">
                                    <option v-for="suffix in arr_suffix" v-bind:value="suffix.id">{{suffix.text}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="form-label" for="user_position">User's Position</label>
                                <select class="js-example-basic-single-position" id="user_position" name="state" style="width: 100%"
                                        v-model="str_position_id">
                                    <option v-for="position in arr_position" v-bind:value="position.id">{{position.text}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 5px">
                            <div class="form-group text-left col-md-6">
                                <div class="custom-control custom-checkbox" style="cursor: hand">
                                    <input type="checkbox" class="custom-control-input" id="userenabled"
                                           v-model="bool_new_user_account_enabled">
                                    <label class="custom-control-label" for="userenabled"> Account Enabled</label>
                                </div>
                            </div>
                            <div class="form-group text-left col-md-6">
                                <div class="custom-control custom-checkbox" style="cursor: hand">
                                    <input type="checkbox" class="custom-control-input" id="passchange"
                                           v-model="bool_new_user_password_change">
                                    <label class="custom-control-label" for="passchange"> Require Password Change</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary" style="float: right"
                                v-bind:disabled="bool_add_edit_button_disabled"
                                type="submit"><i v-bind:class="str_add_edit_button_icon"></i>&nbsp;&nbsp;{{str_add_edit_button_text}}</button>
                    </form>
                    <span style="color: Dodgerblue; text-align: center" v-if="bool_form_loading">
<div class="row">
    <div class="col-lg-12">
        <b class="col-lg-12" style="text-align: center; display: inline-block; width: 100%; font-size: 20px;">{{str_loading_text}}</b>
    </div>
</div>
                                            <div class="row">
                                                <i class="fad fa-spinner fa-spin col-lg-12" style="text-align: center; display: inline-block; width: 100%; font-size: 48px;"></i>
                                            </div>
                                            </span>
                </div>

            </div>
        </div>
    </div>

</div>
` // End Template

export { AddEditUserTemplate }
