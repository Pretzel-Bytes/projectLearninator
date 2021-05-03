const NavBarTemplate = `
<div>
    <aside class="page-sidebar">
        <div class="page-logo">
            <a href="#" class="page-logo-link press-scale-down d-flex align-items-center position-relative" data-toggle="modal" data-target="#modal-shortcut">
                <img src="../../../../assets/img/smartadmin/logo.png" alt="SmartAdmin WebApp" aria-roledescription="logo">
                <span class="page-logo-text mr-1">{{str_app_name}}</span>
                <span class="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2">{{str_app_subname}}</span>
                <i class="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
            </a>
        </div>
        <!-- BEGIN PRIMARY NAVIGATION -->
        <nav id="js-primary-nav" class="primary-nav" role="navigation">
            <div class="nav-filter">
                <div class="position-relative">
                    <input type="text" id="nav_filter_input" placeholder="Filter menu" class="form-control" tabindex="0">
                    <a href="#" onclick="return false;" class="btn-primary btn-search-close js-waves-off" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar">
                        <i class="fal fa-chevron-up"></i>
                    </a>
                </div>
            </div>
            <div class="info-card">
                <img src="../../../../assets/img/smartadmin/demo/avatars/avatar-admin.png" class="profile-image rounded-circle" alt="Dr. Codex Lantern">
                <div class="info-card-text">
                    <a href="#" class="d-flex align-items-center text-white">
                                    <span class="d-inline-block"> <!--text-truncate text-truncate-sm -->
                                       DisplayName
                                    </span>
                    </a>
                    <span class="d-inline-block text-truncate text-truncate-sm">Position</span>
                </div>
                <img src="../../../../assets/img/smartadmin/card-backgrounds/cover-2-lg.png" class="cover" alt="cover">
                <a href="#" onclick="return false;" class="pull-trigger-btn" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar" data-focus="nav_filter_input">
                    <i class="fal fa-angle-down"></i>
                </a>
            </div>
            <!--
        TIP: The menu items are not auto translated. You must have a residing lang file associated with the menu saved inside dist/../assets/media/data with reference to each 'data-i18n' attribute.
        -->
            <ul id="js-nav-menu" class="nav-menu">
                <template v-for="node in arr_navigation_without_child">
                    <li v-bind:class="{active: currentRouteName.includes(node.route_path)}">
                        <router-link v-bind:to="node.route_path"  v-bind:data-filter-tags="node.filter_tags">
                            <i  v-bind:class="node.icon"></i>
                            <span class="nav-link-text">{{node.name}}</span>
                        </router-link>
                    </li>
                </template>
                <template  v-for="node in arr_navigation_with_child">
                    <li v-bind:class="{active: currentRouteName.includes(node.route_path)}">
                        <a  v-bind:title="node.name" v-bind:data-filter-tags="node.name">
                            <i v-bind:class="node.icon"></i>
                            <span class="nav-link-text">{{node.name}}</span>
                        </a>
                        <ul v-for="child in node.children">
                            <li v-bind:class="{active: currentRouteName.includes(child.route_path)}">
                                <router-link v-bind:to="child.route_path" v-bind:data-filter-tags="child.filter_tags" class="router-link-active">
                                    <i v-bind:class="child.icon"></i>
                                    <span class="nav-link-text">{{child.name}}</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </template>
            </ul>
                <div class="filter-message js-filter-message bg-success-600"></div>
        </nav>
        <!-- NAV FOOTER -->
                            <div class="nav-footer shadow-top">
                                <a href="#" onclick="return false;" data-action="toggle" data-class="nav-function-minify" class="hidden-md-down">
                                    <i class="ni ni-chevron-right"></i>
                                    <i class="ni ni-chevron-right"></i>
                                </a>
                                <ul class="list-table m-auto nav-footer-buttons">
                                    <li>
                                        <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="Chat logs">
                                            <i class="fal fa-comments"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="Support Chat">
                                            <i class="fal fa-life-ring"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="Make a call">
                                            <i class="fal fa-phone"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div> <!-- END NAV FOOTER -->
    </aside>


    <div class="modal fade modal-backdrop-transparent" id="modal-shortcut" tabindex="-1" role="dialog" aria-labelledby="modal-shortcut" aria-hidden="true">
        <div class="modal-dialog modal-dialog-top modal-transparent" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <ul class="app-list w-auto h-auto p-0 text-left">
                        <li>
                            <a href="intel_introduction.html" class="app-list-item text-white border-0 m-0">
                                <div class="icon-stack">
                                    <i class="base base-7 icon-stack-3x opacity-100 color-primary-500 "></i>
                                    <i class="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                                    <i class="fal fa-home icon-stack-1x opacity-100 color-white"></i>
                                </div>
                                <span class="app-list-name">
                                                    Home
                                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="page_inbox_general.html" class="app-list-item text-white border-0 m-0">
                                <div class="icon-stack">
                                    <i class="base base-7 icon-stack-3x opacity-100 color-success-500 "></i>
                                    <i class="base base-7 icon-stack-2x opacity-100 color-success-300 "></i>
                                    <i class="ni ni-envelope icon-stack-1x text-white"></i>
                                </div>
                                <span class="app-list-name">
                                                    Inbox
                                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="intel_introduction.html" class="app-list-item text-white border-0 m-0">
                                <div class="icon-stack">
                                    <i class="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                                    <i class="fal fa-plus icon-stack-1x opacity-100 color-white"></i>
                                </div>
                                <span class="app-list-name">
                                                    Add More
                                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
` // End Template

export { NavBarTemplate }
