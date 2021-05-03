const AddEditSuffixTemplate = `
<div>
    <div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="suffixModal">
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
                    <form @submit.prevent="start_add_suffix" autocomplete="off" style="width: 100%"
                        v-if="bool_add_suffix">
                        <div class="form-group">
                            <label class="form-label" for="suffix">Suffix</label>
                            <input type="text" id="suffix" ref="suffix" class="form-control" placeholder="Suffix"
                                v-model="str_add_suffix_name" :disabled="bool_adding_suffix" required>
                        </div>
                        <button type="button" class="btn btn-primary" type="submit" :disabled="bool_adding_suffix">
                            <i
                                :class="str_add_suffix_button_class"></i>&nbsp;{{str_add_suffix_button_text}}</button><br>
                        <span class="help-block" v-if="bool_added_or_edited">
                            Added:<ul><template v-for="suffix in arr_suffixes_added">
                                    <li>{{suffix}}</li>
                                </template></ul>
                        </span>
                    </form>
                    <form @submit.prevent="start_change_suffix" autocomplete="off" style="width: 100%"
                        v-if="!bool_add_suffix">
                        <div class="form-group">
                            <label class="form-label" for="esuffix">Suffix</label>
                            <input type="text" id="esuffix" ref="esuffix" class="form-control" placeholder="Suffix"
                                v-model="str_edit_suffix_text_bind" :disabled="bool_adding_suffix" required>
                            <span class="help-block">
                                From Database: {{str_edit_suffix_text_db}}
                            </span>
                        </div>
                        <button type="button" class="btn btn-primary" type="submit"
                            :disabled="bool_adding_suffix || str_edit_suffix_text_bind === str_edit_suffix_text_db">
                            <i
                                :class="str_add_suffix_button_class"></i>&nbsp;{{str_add_suffix_button_text}}</button><br>

                    </form>
                    <br>
                    <a class="btn btn-default" @click="close">Close</a>
                </div>

            </div>
        </div>
    </div>

</div>
` // End Template

export { AddEditSuffixTemplate }