const EditUserTemplate = `
<div>
<div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="editUserModal">
   <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
      <div class="modal-content">
         <div class="modal-header">
            <h4 class="modal-title text-white">
               Edit User
            </h4>
            <button type="button" class="close text-white" @click="close" aria-label="Close">
            <span aria-hidden="true"><i class="fal fa-times"></i></span>
            </button>
         </div>
         <div class="modal-body">
            <div class="row" v-if="bool_loading_data">
               <div class="col-lg-12" style="font-size: 20px; color: Dodgerblue;">
                  <p style="text-align: center">Loading User Information...</p>
               </div>
            </div>
            <div class="row" v-if="bool_loading_data">
               <div class="col-lg-12" style="font-size: 48px; color: Dodgerblue; text-align: center">
                  <i class="fad fa-spinner fa-spin" style="text-align: center; display: inline-block; width: 100%"></i>
               </div>
            </div>
            <div class="row" v-if="!bool_loading_data">
               <form @submit.prevent="start_add_user" autocomplete="off" style="width: 100%">
                  <div class="form-group">
                     <label class="form-label" for="firstname">First Name</label>
                     <input type="text" id="firstname" class="form-control" placeholder="First Name" 
                        v-model="str_first_name" required>
                     <span class="help-block">
                     From Database: {{ str_orig_first_name }}
                     </span>
                  </div>
                  <div class="form-group">
                     <label class="form-label" for="lastname">Last Name</label>
                     <input type="text" id="lastname" class="form-control" placeholder="Last Name" 
                        v-model="str_last_name" required>
                     <span class="help-block">
                     From Database: {{ str_orig_last_name }}
                     </span>
                  </div>
                  <div class="form-group">
                     <label class="form-label" for="username">Username</label>
                     <input type="text" id="username" class="form-control" placeholder="username" 
                        v-model="str_username" required>
                     <span class="help-block">
                     From Database: {{ str_orig_username }}
                     </span>
                  </div>
                  <span style="color: red" v-if="str_first_name !== str_orig_first_name ||
                     str_last_name !== str_orig_last_name || str_username !== str_orig_username">Changes Made<br></span>
                  <button type="button" class="btn btn-primary" type="submit"
                     :disabled="str_first_name === str_orig_first_name &&
                     str_last_name === str_orig_last_name && str_username === str_orig_username">Save Changes</button>
                  <button type="button" class="btn btn-secondary" @click="close">Close</button>
               </form>
            </div>
         </div>
      </div>
   </div>
</div>
` // End Template

export { EditUserTemplate }
