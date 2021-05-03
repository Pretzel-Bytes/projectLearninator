from api.core.core_authentication.check_permission import CheckPermissions
from mysql.connector import connect, Error
from global_vars import GlobalVars
from uuid import uuid4


class ClassName:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = ClassName(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="ClassName",
                str_file="user_prefix/add_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_function_name(self):
        dict_return = dict()
        dict_return["obj_permission_check"] = dict()
        dict_return["obj_permission_check"]["bool_error"] = False
        dict_return["obj_permission_check"]['str_error_text'] = None
        dict_return["obj_permission_check"]['bool_user_has_permission'] = False
        dict_return["obj_permission_check"]['bool_session_valid'] = False
        dict_return["obj_return_data"] = dict()
        # Check User Permissions
        dict_permission_check = CheckPermissions(self.my_logger).check('core_user_management', 'get_user_list')
        if dict_permission_check['bool_error']:
            dict_return["obj_permission_check"]['str_error_text'] = dict_permission_check['str_error_text']
            dict_return["obj_permission_check"]["bool_error"] = True
            return dict_return
        if not dict_permission_check['bool_session_valid']:
            return dict_return
        dict_return["obj_permission_check"]['bool_session_valid'] = True
        if not dict_permission_check['bool_user_has_permission']:
            return dict_return
        dict_return["obj_permission_check"]['bool_user_has_permission'] = True
        # Permissions Good, Continue


class ClassNameMySql:
    my_logger = None
    my_sql_vars = GlobalVars.MySql()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="ClassNameMySql",
                str_file="user_prefix/add_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))