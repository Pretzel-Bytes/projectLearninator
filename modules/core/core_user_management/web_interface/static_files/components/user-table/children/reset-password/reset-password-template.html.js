const ResetPasswordTemplate = `
<div>
    <div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="resetPasswordModal">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-white">
                        Reset Password
                    </h4>
                    <button type="button" class="close text-white" @click="close" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="start_add_user" autocomplete="off" style="width: 100%">
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label class="form-label" for="password">New Password</label>
                                <input v-bind:type="str_password_type" id="password" class="form-control"
                                    placeholder="P@55w0rd!" v-model="str_new_password" autocomplete="new-password"
                                    required>
                                <span >
                                    Reset Password For: <b style="color: red;">{{str_username}}</b>
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <a v-bind:class="str_show_hide_password_icon" href="javascript:void(0)"
                                    v-on:click="show_hide_password(false)"> {{str_show_hide_password_text}}</a>

                            </div>
                        </div>
                        <div class="row" v-show="str_password_type==='text'">
                            <div class="col-md-12">
                                <span class="password_color" style="word-wrap: break-word;"><span v-for="char in arr_password">{{char}}</span></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <a class="fas fa-sync" href="javascript:void(0)" v-on:click="generatePassword()">
                                    Generate
                                    Password</a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group text-left col-md-12">
                                <div class="custom-control custom-checkbox" style="cursor: hand">
                                    <input type="checkbox" class="custom-control-input" id="passchange"
                                        v-model="bool_require_password_change">
                                    <label class="custom-control-label" for="passchange"> Require Password
                                        Change</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <button type="button" class="btn btn-primary col-md-12" type="submit">Change
                                Password</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

</div>
` // End Template

export { ResetPasswordTemplate }
