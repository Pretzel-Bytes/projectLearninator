const LoadingRoutesTemplate = `
        <main id="js-page-content" role="main" class="page-content">
                        <div class="subheader"></div>
                        <div class="h-alt-hf d-flex flex-column align-items-center justify-content-center text-center">
                            <h1 class="page-error color-fusion-500" v-if="!bool_error_state">
                                Loading Modules
                                <small class="fw-500" >
                                    Loading Modules
                                </small> 
                            </h1>
                            Will redirect to: {{str_redirect_url}}
                            <h1 class="page-error color-fusion-500" v-if="bool_error_state">
                                Loading Modules Error
                                <small class="fw-500" >
                                    Error Loading Modules, Try Again
                                </small>
                            </h1>
                        </div>
                    </main>
` // End Template

export { LoadingRoutesTemplate }
