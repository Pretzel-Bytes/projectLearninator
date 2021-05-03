const UserManagementTemplate = `
<div>
    <ol class="breadcrumb page-breadcrumb">
        <li class="breadcrumb-item"><a href="javascript:void(0);">{{ str_app_name }}</a></li>
        <li class="breadcrumb-item">Settings</li>
        <li class="breadcrumb-item active">User Management</li>
        <!--  <li class="position-absolute pos-top pos-right d-none d-sm-block"><span class="js-get-date"></span></li>-->
    </ol>
    <div class="row">
        <div class="col-xl-12">
            <userTable :parentData="obj_data_for_user_Table"></userTable>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-6">
            <UserPrefix :parentData="obj_data_for_user_prefix"></UserPrefix>
        </div>
        <div class="col-md-6">
            <UserSuffix :parentData="obj_data_for_user_suffix"></UserSuffix>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <UserPosition :parentData="obj_data_for_user_position"></UserPosition>
        </div>
    </div>
    <router-view @data="onData"></router-view>
</div>
` // End Template

export {
UserManagementTemplate
}