const AddEditPositionTemplate = `
<div>
    <div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="positionModal">
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
                    <form @submit.prevent="start_add_position" autocomplete="off" style="width: 100%"
                        v-if="bool_add_position">
                        <div class="form-group">
                            <label class="form-label" for="position">Position</label>
                            <input type="text" id="position" ref="position" class="form-control" placeholder="Position"
                                v-model="str_add_position_name" :disabled="bool_adding_position" required>
                        </div>
                        <button type="button" class="btn btn-primary" type="submit" :disabled="bool_adding_position">
                            <i
                                :class="str_add_position_button_class"></i>&nbsp;{{str_add_position_button_text}}</button><br>
                        <span class="help-block" v-if="bool_added_or_edited">
                            Added:<ul><template v-for="position in arr_positiones_added">
                                    <li>{{position}}</li>
                                </template></ul>
                        </span>
                    </form>
                    <form @submit.prevent="start_change_position" autocomplete="off" style="width: 100%"
                        v-if="!bool_add_position">
                        <div class="form-group">
                            <label class="form-label" for="eposition">Position</label>
                            <input type="text" id="eposition" ref="eposition" class="form-control" placeholder="Position"
                                v-model="str_edit_position_text_bind" :disabled="bool_adding_position" required>
                            <span class="help-block">
                                From Database: {{str_edit_position_text_db}}
                            </span>
                        </div>
                        <button type="button" class="btn btn-primary" type="submit"
                            :disabled="bool_adding_position || str_edit_position_text_bind === str_edit_position_text_db">
                            <i
                                :class="str_add_position_button_class"></i>&nbsp;{{str_add_position_button_text}}</button><br>

                    </form>
                    <br>
                    <a class="btn btn-default" @click="close">Close</a>
                </div>

            </div>
        </div>
    </div>

</div>
` // End Template

export { AddEditPositionTemplate }