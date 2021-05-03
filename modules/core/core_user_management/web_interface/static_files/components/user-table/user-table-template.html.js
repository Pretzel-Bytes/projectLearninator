const UserTableTemplate = `
<div>
    <div id="panel-4" class="panel">
        <div class="panel-hdr">
            <i class="fas fa-user"> </i> <h2>
            &nbsp;System Users
        </h2>
            <div class="panel-toolbar">
                <router-link class="btn btn-primary btn-sm fas fa-user-plus" data-offset="0,10"
                        data-original-title="Add User" data-toggle="tooltip" data-target=".add-user-modal"
                        :to="{name: 'core_user_management-add_user', params: {}}"></router-link>&nbsp;
                <button class="btn btn-primary btn-sm fas fa-sync-alt" data-toggle="tooltip" data-offset="0,10" data-original-title="Refresh User List" v-on:click="getUserListing()"></button>
                <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></button>
                <button class="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"></button>
                <button class="btn btn-panel" data-action="panel-close" data-toggle="tooltip" data-offset="0,10" data-original-title="Close" style="display: none"></button>
            </div>
        </div>
        <div class="panel-container show">
            <div class="panel-content">
<!--                <div id="myGrid" style="height: 100%; overflow: hidden;" class="ag-theme-alpine"></div>-->

                <table class="table table-striped table-hover table-responsive table-sm" id="myTable" v-if="!bool_loading_user_list" style="width: 100%;">
                    <thead>
                    <tr>

                        <th>Actions</th>
                        <th>Prefix</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Suffix</th>
                        <th>Position</th>
                        <th>Username</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="user in arr_users">
                        <tr>
                            <td>
                                <router-link :to="{name: 'core_user_management-edit_user', params: {id: user.id_user}}"
                                             class="fas fa-user-edit" style="cursor: pointer; font-size: large" title="Edit User"></router-link>&nbsp;

                                <router-link v-bind:class="{'fas fa-user-lock': user.user_enabled, 'fas fa-user-unlock': !user.user_enabled}"
                                   style="cursor: pointer; font-size: large" v-bind:title="{'Disable User': user.user_enabled, 'Enable User': !user.user_enabled}"
                                             :to="{name: 'core_user_management-edit_user', params: {id: user.id_user}}"></router-link>&nbsp;
                                <router-link :to="{name: 'core_user_management-reset-password', params: {id: user.id_user, name: user.user_name}}" 
                                             class="fad fa-key" style="cursor: pointer; font-size: large" title="Reset Password"></router-link>

                            </td>
                            <td>{{user.prefix}}</td>
                            <td>{{ user.first_name }}</td>
                            <td>{{ user.sur_name }}</td>
                            <td>{{user.suffix}}</td>
                            <td>{{user.position}}</td>
                            <td>{{ user.user_name }}</td>
                            <td>
                                                        <span v-bind:class="{'badge badge-success badge-pill': user.user_enabled, 'badge badge-warning badge-pill': !user.user_enabled}">
                                                        <b v-if="user.user_enabled">Account Enabled</b><b v-if="!user.user_enabled">Account Disabled</b></span>
                                <span v-if="user.password_change_required" class="badge badge-info badge-pill">Password Change Required</span></td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <span style="font-size: 48px; color: Dodgerblue; text-align: center" v-if="bool_loading_user_list">
                                            <i class="fad fa-spinner fa-spin" style="text-align: center; display: inline-block; width: 100%"></i>
                                            </span>
            </div>
        </div>
    </div>
    <ul id="contextMenu" class="dropdown-menu" role="menu" style="display:none" >
        <li><a tabindex="-1" id="filter">Filter</a></li>
        <li><a tabindex="-1" id="clearFilter">Clear Filter</a></li>
    </ul>
</div>
` // End Template

export { UserTableTemplate }
