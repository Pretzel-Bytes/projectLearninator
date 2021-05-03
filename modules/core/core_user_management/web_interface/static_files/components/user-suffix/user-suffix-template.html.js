const UserSuffixTemplate = `
<div>
    <!-- To be displayed correctly, all content must go within this div -->
    <div id="panel-4" class="panel">
        <div class="panel-hdr">
            <i class="fas fa-caret-left"> </i>
            <h2>
                &nbsp;User Suffix
            </h2>
            <div class="panel-toolbar">

                <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip"
                    data-offset="0,10" data-original-title="Collapse/Expand"></button>
                <button class="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip"
                    data-offset="0,10" data-original-title="Fullscreen"></button>
                <button class="btn btn-panel" data-action="panel-close" data-toggle="tooltip" data-offset="0,10"
                    data-original-title="Close" style="display: none"></button>
            </div>
        </div>
        <div class="panel-container collapse">
            <div class="panel-content">
                <div class="row" v-if="!bool_loading_user_suffix">
                    <div class="col-sm-6">
                        <router-link class="btn btn-primary btn-sm fas fa-plus" data-original-title="Add Suffix"
                            data-toggle="tooltip"
                            :to="{name: 'core_user_management-add-edit-suffix', params: {id: 'add'}}">
                        </router-link>
                        <button class="btn btn-primary btn-sm fas fa-sync-alt" data-toggle="tooltip"
                            data-offset="0,10" data-original-title="Refresh Suffix List"
                            v-on:click="get_suffix_listing()"></button>
                    </div>
                </div>
                <div class="row" style="margin-top: 5px" v-if="!bool_loading_user_suffix">
                    <div class="col-md-6">
                        <select class="js-example-basic-single" name="state" style="width: 100%"
                            v-model="str_id_suffix_selected">
                            <option v-for="suffix in arr_suffix" v-bind:value="suffix.id">{{suffix.text}}
                            </option>
                        </select>

                    </div>
                    <div class="col-xs-3">
                        <router-link class="btn btn-sm btn-primary" v-if="!bool_no_suffix_selected"
                            :to="{name: 'core_user_management-add-edit-suffix', params: {id: str_id_suffix_selected}}">
                            <i class="fas fa-pencil"></i></router-link>
                    </div>
                    <div class="col-sm-2">
                        <router-link class="btn btn-sm btn-danger" v-if="!bool_no_suffix_selected"
                            :to="{name: 'core_user_management-delete-suffix', params: {id: str_id_suffix_selected}}">
                            <i class="fas fa-trash"></i></router-link>
                    </div>
                </div>
                <span style="font-size: 48px; color: Dodgerblue; text-align: center"
                    v-if="bool_loading_user_suffix">
                    <i class="fad fa-spinner fa-spin"
                        style="text-align: center; display: inline-block; width: 100%"></i>
                </span>
            </div>
        </div>
    </div>
</div>
` // End Template

export { UserSuffixTemplate }