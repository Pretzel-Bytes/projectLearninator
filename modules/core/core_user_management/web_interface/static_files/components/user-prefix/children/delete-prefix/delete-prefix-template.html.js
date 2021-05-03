const DeletePrefixTemplate = `
<div>
    <div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="prefixModal">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-white">
                        Delete User Prefix
                    </h4>
                    <button type="button" class="close text-white" @click="close" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12" style="font-size: large">Prefix to Delete: <b>{{ str_prefix_text }}</b>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12"><button class="btn btn-danger" :disabled="bool_locking_action"
                                @mousedown="delete_mouse_down" @mouseup="delete_mouse_up">
                                <i :class="str_delete_prefix_button_class"></i> {{str_delete_prefix_button_text}}
                                {{str_delete_prefix_button_additional_text_1}} {{count}}
                                {{str_delete_prefix_button_additional_text_2}}</button></div>
                    </div>
                    <br>
                    <a class="btn btn-primary" @click="close">Cancel</a>
                </div>

            </div>
        </div>
    </div>

</div>
` // End Template

export { DeletePrefixTemplate }