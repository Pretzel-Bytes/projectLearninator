const AddEditPrefixTemplate = `
<div>
    <div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="prefixModal">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-white">
                        {{str_title_text}}
                    </h4>
                    <button type="button" class="close text-white" @click="close" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="start_add_prefix" autocomplete="off" style="width: 100%"
                        v-if="bool_add_prefix">
                        <div class="form-group">
                            <label class="form-label" for="prefix">Prefix</label>
                            <input type="text" id="prefix" ref="prefix" class="form-control" placeholder="Prefix"
                                v-model="str_add_prefix_name" :disabled="bool_adding_prefix" required>
                        </div>
                        <button type="button" class="btn btn-primary" type="submit" :disabled="bool_adding_prefix">
                            <i
                                :class="str_add_prefix_button_class"></i>&nbsp;{{str_add_prefix_button_text}}</button><br>
                        <span class="help-block" v-if="bool_added_or_edited">
                            Added:<ul><template v-for="prefix in arr_prefixes_added">
                                    <li>{{prefix}}</li>
                                </template></ul>
                        </span>
                    </form>
                    <form @submit.prevent="start_change_prefix" autocomplete="off" style="width: 100%"
                        v-if="!bool_add_prefix">
                        <div class="form-group">
                            <label class="form-label" for="eprefix">Prefix</label>
                            <input type="text" id="eprefix" ref="eprefix" class="form-control" placeholder="Prefix"
                                v-model="str_edit_prefix_text_bind" :disabled="bool_adding_prefix" required>
                            <span class="help-block">
                                From Database: {{str_edit_prefix_text_db}}
                            </span>
                        </div>
                        <button type="button" class="btn btn-primary" type="submit"
                            :disabled="bool_adding_prefix || str_edit_prefix_text_bind === str_edit_prefix_text_db">
                            <i
                                :class="str_add_prefix_button_class"></i>&nbsp;{{str_add_prefix_button_text}}</button><br>

                    </form>
                    <br>
                    <a class="btn btn-default" @click="close">Close</a>
                </div>

            </div>
        </div>
    </div>

</div>
` // End Template

export { AddEditPrefixTemplate }