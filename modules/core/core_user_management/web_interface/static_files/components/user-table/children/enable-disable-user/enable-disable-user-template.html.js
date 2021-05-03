const EnableDisableUserTemplate = `
<div>
<div class="modal fade add-user-modal" tabindex="-1" role="dialog" aria-hidden="true" id="editUserModal">
                                                <div class="modal-dialog modal-dialog-centered" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h4 class="modal-title text-white">
                                                                Add a User
                                                            </h4>
                                                            <button type="button" class="close text-white" @click="close" aria-label="Close">
                                                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
<a class="btn" @click="close">Close</a>
                                                        </div>
                                                      
                                                    </div>
                                                </div>
                                            </div>

</div>
` // End Template

export { EnableDisableUserTemplate }
