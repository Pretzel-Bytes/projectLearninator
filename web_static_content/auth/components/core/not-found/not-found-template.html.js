const NotFoundTemplate = `
        <main id="js-page-content" role="main" class="page-content">
                        <div class="subheader"></div>
                        <div class="h-alt-hf d-flex flex-column align-items-center justify-content-center text-center">
                            <h1 class="page-error color-fusion-500">
                                ERROR <span class="text-gradient">404</span>
                                <small class="fw-500">
                                    You (or a link) <u>went</u> wrong!
                                </small>
                            </h1>
                            <router-link to="/login"><b>Go to Login Page</b></router-link>
                        </div>
                    </main>
` // End Template

export { NotFoundTemplate }
