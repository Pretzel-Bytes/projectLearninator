const ResetPasswordTemplate = `
        <div class="blankpage-form-field">
            <div class="page-logo m-0 w-100 align-items-center justify-content-center rounded border-bottom-left-radius-0 border-bottom-right-radius-0 px-4">
                <a href="javascript:void(0)" class="page-logo-link press-scale-down d-flex align-items-center">
                    <img src="../assets/img/smartadmin/logo.png" alt="SmartAdmin WebApp" aria-roledescription="logo">
                    <span class="page-logo-text mr-1">{{ str_app_name }} | Reset Password</span>
                    <i class="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
                </a>
            </div>
            <div class="card p-4 border-top-left-radius-0 border-top-right-radius-0">
                <form @submit.prevent="submitChange">
                <div class="form-group" v-if="!bool_reset_code_disabled">
                        <label class="form-label" for="resetCode">Reset Code</label>
                        <input type="text" id="resetCode" class="form-control" placeholder="Reset Code" 
                        v-model="str_reset_code" :disabled="bool_reset_code_disabled" required>
                        <span class="help-block">
                            Password Reset Code
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="password1">New Password</label>
                        <input type="password" id="password1" class="form-control" placeholder="password" 
                        v-model="str_password_1" :disabled="bool_password_disabled" required>
                        <span class="help-block">
                            Your new password
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="password2">Confirm Password</label>
                        <input type="password" id="password2" class="form-control" placeholder="password" 
                        v-model="str_password_2" :disabled="bool_password_disabled" required>
                        <span class="help-block">
                            Confirm your new password
                        </span>
                    </div>
                    <button type="submit" class="btn btn-default float-right" :disabled=bool_change_button_disabled><i v-bind:class="str_change_button_icon"></i>
                    {{ str_change_button_text }}</button>
                </form>
            </div>
            <div class="blankpage-footer text-center">
                <a href="#"><strong>Recover Password</strong></a> | <a href="#"><strong>Register Account</strong></a>
            </div>
        </div>
        <div class="login-footer p-2">
            <div class="row">
                <div class="col col-sm-12 text-center">
                    <i><strong>System Message:</strong> You were logged out from 198.164.246.1 on Saturday, March, 2017 at 10.56AM</i>
                </div>
            </div>
        </div>
` // End Template

export { ResetPasswordTemplate }
