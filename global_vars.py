class GlobalVars:
    class Sessions:
        login_session_time_limit = 300
        user_session_idle_time_limit_remember_me = 25200
        user_session_idle_time_limit = 10080

    class WebComponents:
        arr_routes = []
        arr_navigation = [
            {"name": "Dashboard",
             "icon": "fas fa-home",
             "route_path": "/dashboard",
             "filter_tags": "dashboard"
             }
        ]

    class Permissions:
        arr_permissions = []

    class Logging:
        str_log_dir = './logs/'
        str_log_level = 'debug'
