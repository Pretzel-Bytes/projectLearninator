// Note that these are backticks.

const MainTemplate = `

<div class="page-wrapper">
  <div class="page-inner">
    <!-- BEGIN Left Aside -->
    <appNavbar></appNavbar>
    <!-- END Left Aside -->
    <div class="page-content-wrapper">
      <!-- BEGIN Page Header -->
      <appHeader></appHeader>
      <!-- END Page Header -->
      <!-- BEGIN Page Content -->
      <!-- the #js-page-content id is needed for some plugins to initialize -->
      <main id="js-page-content" role="main" class="page-content">
        <router-view></router-view>
      </main>
      <!-- this overlay is activated only when mobile menu is triggered -->
      <div class="page-content-overlay" data-action="toggle" data-class="mobile-nav-on"></div> <!-- END Page Content -->
      <!-- BEGIN Page Footer -->
      <footer class="page-footer" role="contentinfo">
        <appFooter></appFooter>
      </footer>
      <!-- END Page Footer -->
      <!-- BEGIN Shortcuts -->
      <!-- END Shortcuts -->
      <!-- BEGIN Color profile -->
      <!-- this area is hidden and will not be seen on screens or screen readers -->
      <!-- we use this only for CSS color refernce for JS stuff -->
      <p id="js-color-profile" class="d-none">
        <span class="color-primary-50"></span>
        <span class="color-primary-100"></span>
        <span class="color-primary-200"></span>
        <span class="color-primary-300"></span>
        <span class="color-primary-400"></span>
        <span class="color-primary-500"></span>
        <span class="color-primary-600"></span>
        <span class="color-primary-700"></span>
        <span class="color-primary-800"></span>
        <span class="color-primary-900"></span>
        <span class="color-info-50"></span>
        <span class="color-info-100"></span>
        <span class="color-info-200"></span>
        <span class="color-info-300"></span>
        <span class="color-info-400"></span>
        <span class="color-info-500"></span>
        <span class="color-info-600"></span>
        <span class="color-info-700"></span>
        <span class="color-info-800"></span>
        <span class="color-info-900"></span>
        <span class="color-danger-50"></span>
        <span class="color-danger-100"></span>
        <span class="color-danger-200"></span>
        <span class="color-danger-300"></span>
        <span class="color-danger-400"></span>
        <span class="color-danger-500"></span>
        <span class="color-danger-600"></span>
        <span class="color-danger-700"></span>
        <span class="color-danger-800"></span>
        <span class="color-danger-900"></span>
        <span class="color-warning-50"></span>
        <span class="color-warning-100"></span>
        <span class="color-warning-200"></span>
        <span class="color-warning-300"></span>
        <span class="color-warning-400"></span>
        <span class="color-warning-500"></span>
        <span class="color-warning-600"></span>
        <span class="color-warning-700"></span>
        <span class="color-warning-800"></span>
        <span class="color-warning-900"></span>
        <span class="color-success-50"></span>
        <span class="color-success-100"></span>
        <span class="color-success-200"></span>
        <span class="color-success-300"></span>
        <span class="color-success-400"></span>
        <span class="color-success-500"></span>
        <span class="color-success-600"></span>
        <span class="color-success-700"></span>
        <span class="color-success-800"></span>
        <span class="color-success-900"></span>
        <span class="color-fusion-50"></span>
        <span class="color-fusion-100"></span>
        <span class="color-fusion-200"></span>
        <span class="color-fusion-300"></span>
        <span class="color-fusion-400"></span>
        <span class="color-fusion-500"></span>
        <span class="color-fusion-600"></span>
        <span class="color-fusion-700"></span>
        <span class="color-fusion-800"></span>
        <span class="color-fusion-900"></span>
      </p>
      <!-- END Color profile -->
    </div>
  </div>
</div>
<!-- END Page Wrapper -->
<!-- BEGIN Quick Menu -->
<!-- to add more items, please make sure to change the variable '$menu-items: number;' in your _page-components-shortcut.scss -->
<nav class="shortcut-menu d-none d-sm-block">
  <input type="checkbox" class="menu-open" name="menu-open" id="menu_open" />
  <label for="menu_open" class="menu-open-button ">
    <span class="app-shortcut-icon d-block"></span>
  </label>
  <a href="#" class="menu-item btn" data-toggle="tooltip" data-placement="left" title="Scroll Top">
    <i class="fal fa-arrow-up"></i>
  </a>
  <a href="page_login.html" class="menu-item btn" data-toggle="tooltip" data-placement="left" title="Logout">
    <i class="fal fa-sign-out"></i>
  </a>
  <a href="#" class="menu-item btn" data-action="app-fullscreen" data-toggle="tooltip" data-placement="left" title="Full Screen">
    <i class="fal fa-expand"></i>
  </a>
  <a href="#" class="menu-item btn" data-action="app-print" data-toggle="tooltip" data-placement="left" title="Print page">
    <i class="fal fa-print"></i>
  </a>
  <a href="#" class="menu-item btn" data-action="app-voice" data-toggle="tooltip" data-placement="left" title="Voice command">
    <i class="fal fa-microphone"></i>
  </a>
</nav>
<!-- END Quick Menu -->
<!-- BEGIN Messenger -->
<div class="modal fade js-modal-messenger modal-backdrop-transparent" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-right">
    <div class="modal-content h-100">
      <div class="dropdown-header bg-trans-gradient d-flex align-items-center w-100">
        <div class="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                            <span class="mr-2">
                                <span class="rounded-circle profile-image d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-d.png'); background-size: cover;"></span>
                            </span>
          <div class="info-card-text">
            <a href="javascript:void(0);" class="fs-lg text-truncate text-truncate-lg text-white" data-toggle="dropdown" aria-expanded="false">
              Tracey Chang
              <i class="fal fa-angle-down d-inline-block ml-1 text-white fs-md"></i>
            </a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#">Send Email</a>
              <a class="dropdown-item" href="#">Create Appointment</a>
              <a class="dropdown-item" href="#">Block User</a>
            </div>
            <span class="text-truncate text-truncate-md opacity-80">IT Director</span>
          </div>
        </div>
        <button type="button" class="close text-white position-absolute pos-top pos-right p-2 m-1 mr-2" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fal fa-times"></i></span>
        </button>
      </div>
      <div class="modal-body p-0 h-100 d-flex">
        <!-- BEGIN msgr-list -->
        <div class="msgr-list d-flex flex-column bg-faded border-faded border-top-0 border-right-0 border-bottom-0 position-absolute pos-top pos-bottom">
          <div>
            <div class="height-4 width-3 h3 m-0 d-flex justify-content-center flex-column color-primary-500 pl-3 mt-2">
              <i class="fal fa-search"></i>
            </div>
            <input type="text" class="form-control bg-white" id="msgr_listfilter_input" placeholder="Filter contacts" aria-label="FriendSearch" data-listfilter="#js-msgr-listfilter">
          </div>
          <div class="flex-1 h-100 custom-scroll">
            <div class="w-100">
              <ul id="js-msgr-listfilter" class="list-unstyled m-0">
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="tracey chang online">
                    <div class="d-table-cell align-middle status status-success status-sm ">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-d.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        Tracey Chang
                        <small class="d-block font-italic text-success fs-xs">
                          Online
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="oliver kopyuv online">
                    <div class="d-table-cell align-middle status status-success status-sm ">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-b.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        Oliver Kopyuv
                        <small class="d-block font-italic text-success fs-xs">
                          Online
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="dr john cook phd away">
                    <div class="d-table-cell align-middle status status-warning status-sm ">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-e.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        Dr. John Cook PhD
                        <small class="d-block font-italic fs-xs">
                          Away
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney online">
                    <div class="d-table-cell align-middle status status-success status-sm ">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-g.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        Ali Amdaney
                        <small class="d-block font-italic fs-xs text-success">
                          Online
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="sarah mcbrook online">
                    <div class="d-table-cell align-middle status status-success status-sm">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-h.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        Sarah McBrook
                        <small class="d-block font-italic fs-xs text-success">
                          Online
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney offline">
                    <div class="d-table-cell align-middle status status-sm">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-a.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        oliver.kopyuv@gotbootstrap.com
                        <small class="d-block font-italic fs-xs">
                          Offline
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney busy">
                    <div class="d-table-cell align-middle status status-danger status-sm">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-j.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        oliver.kopyuv@gotbootstrap.com
                        <small class="d-block font-italic fs-xs text-danger">
                          Busy
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney offline">
                    <div class="d-table-cell align-middle status status-sm">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-c.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        oliver.kopyuv@gotbootstrap.com
                        <small class="d-block font-italic fs-xs">
                          Offline
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" class="d-table w-100 px-2 py-2 text-dark hover-white" data-filter-tags="ali amdaney inactive">
                    <div class="d-table-cell align-middle">
                      <span class="profile-image-md rounded-circle d-block" style="background-image:url('../../../../assets/img/smartadmin/demo/avatars/avatar-m.png'); background-size: cover;"></span>
                    </div>
                    <div class="d-table-cell w-100 align-middle pl-2 pr-2">
                      <div class="text-truncate text-truncate-md">
                        +714651347790
                        <small class="d-block font-italic fs-xs opacity-50">
                          Missed Call
                        </small>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
              <div class="filter-message js-filter-message"></div>
            </div>
          </div>
          <div>
            <a class="fs-xl d-flex align-items-center p-3">
              <i class="fal fa-cogs"></i>
            </a>
          </div>
        </div>
        <!-- END msgr-list -->
        <!-- BEGIN msgr -->
        <div class="msgr d-flex h-100 flex-column bg-white">
          <!-- BEGIN custom-scroll -->
          <div class="custom-scroll flex-1 h-100">
            <div id="chat_container" class="w-100 p-4">
              <!-- start .chat-segment -->
              <div class="chat-segment">
                <div class="time-stamp text-center mb-2 fw-400">
                  Jun 19
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-sent">
                <div class="chat-message">
                  <p>
                    Hey Tracey, did you get my files?
                  </p>
                </div>
                <div class="text-right fw-300 text-muted mt-1 fs-xs">
                  3:00 pm
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-get">
                <div class="chat-message">
                  <p>
                    Hi
                  </p>
                  <p>
                    Sorry going through a busy time in office. Yes I analyzed the solution.
                  </p>
                  <p>
                    It will require some resource, which I could not manage.
                  </p>
                </div>
                <div class="fw-300 text-muted mt-1 fs-xs">
                  3:24 pm
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-sent chat-start">
                <div class="chat-message">
                  <p>
                    Okay
                  </p>
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-sent chat-end">
                <div class="chat-message">
                  <p>
                    Sending you some dough today, you can allocate the resources to this project.
                  </p>
                </div>
                <div class="text-right fw-300 text-muted mt-1 fs-xs">
                  3:26 pm
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-get chat-start">
                <div class="chat-message">
                  <p>
                    Perfect. Thanks a lot!
                  </p>
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-get">
                <div class="chat-message">
                  <p>
                    I will have them ready by tonight.
                  </p>
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment -->
              <div class="chat-segment chat-segment-get chat-end">
                <div class="chat-message">
                  <p>
                    Cheers
                  </p>
                </div>
              </div>
              <!--  end .chat-segment -->
              <!-- start .chat-segment for timestamp -->
              <div class="chat-segment">
                <div class="time-stamp text-center mb-2 fw-400">
                  Jun 20
                </div>
              </div>
              <!--  end .chat-segment for timestamp -->
            </div>
          </div>
          <!-- END custom-scroll  -->
          <!-- BEGIN msgr__chatinput -->
          <div class="d-flex flex-column">
            <div class="border-faded border-right-0 border-bottom-0 border-left-0 flex-1 mr-3 ml-3 position-relative shadow-top">
              <div class="pt-3 pb-1 pr-0 pl-0 rounded-0" tabindex="-1">
                <div id="msgr_input" contenteditable="true" data-placeholder="Type your message here..." class="height-10 form-content-editable"></div>
              </div>
            </div>
            <div class="height-8 px-3 d-flex flex-row align-items-center flex-wrap flex-shrink-0">
              <a href="javascript:void(0);" class="btn btn-icon fs-xl width-1 mr-1" data-toggle="tooltip" data-original-title="More options" data-placement="top">
                <i class="fal fa-ellipsis-v-alt color-fusion-300"></i>
              </a>
              <a href="javascript:void(0);" class="btn btn-icon fs-xl mr-1" data-toggle="tooltip" data-original-title="Attach files" data-placement="top">
                <i class="fal fa-paperclip color-fusion-300"></i>
              </a>
              <a href="javascript:void(0);" class="btn btn-icon fs-xl mr-1" data-toggle="tooltip" data-original-title="Insert photo" data-placement="top">
                <i class="fal fa-camera color-fusion-300"></i>
              </a>
              <div class="ml-auto">
                <a href="javascript:void(0);" class="btn btn-info">Send</a>
              </div>
            </div>
          </div>
          <!-- END msgr__chatinput -->
        </div>
        <!-- END msgr -->
      </div>
    </div>
  </div>
</div>
<!-- END Messenger -->

` // End Template
export { MainTemplate }
