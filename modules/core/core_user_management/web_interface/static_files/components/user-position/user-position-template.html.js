const UserPositionTemplate = `
<div>
    <!-- To be displayed correctly, all content must go within this div -->
    <div id="panel-4" class="panel">
        <div class="panel-hdr">
            <i class="fas fa-map-pin"> </i>
            <h2>
                &nbsp;User Position
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
                <div class="row" v-if="!bool_loading_user_position">
                    <div class="col-sm-6">
                        <router-link class="btn btn-primary btn-sm fas fa-plus" data-original-title="Add Position"
                            data-toggle="tooltip"
                            :to="{name: 'core_user_management-add-edit-position', params: {id: 'add'}}">
                        </router-link>
                        <button class="btn btn-primary btn-sm fas fa-sync-alt" data-toggle="tooltip"
                            data-offset="0,10" data-original-title="Refresh Position List"
                            v-on:click="get_position_listing()"></button>
                    </div>
                </div>
                <div class="row" style="margin-top: 5px" v-if="!bool_loading_user_position">
                    <div class="col-md-6">
                        <select class="js-example-basic-single" name="state" style="width: 100%"
                            v-model="str_id_position_selected">
                            <option v-for="position in arr_position" v-bind:value="position.id">{{position.text}}
                            </option>
                            </template>
                        </select>

                    </div>
                    <div class="col-xs-3">
                        <router-link class="btn btn-sm btn-primary" v-if="!bool_no_position_selected"
                            :to="{name: 'core_user_management-add-edit-position', params: {id: str_id_position_selected}}">
                            <i class="fas fa-pencil"></i></router-link>
                    </div>
                    <div class="col-sm-2">
                        <router-link class="btn btn-sm btn-danger" v-if="!bool_no_position_selected"
                            :to="{name: 'core_user_management-delete-position', params: {id: str_id_position_selected}}">
                            <i class="fas fa-trash"></i></router-link>
                    </div>
                </div>
                <span style="font-size: 48px; color: Dodgerblue; text-align: center"
                    v-if="bool_loading_user_position">
                    <i class="fad fa-spinner fa-spin"
                        style="text-align: center; display: inline-block; width: 100%"></i>
                </span>
            </div>
        </div>
    </div>
</div>
` // End Template

export { UserPositionTemplate }