from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class GetSingleUser:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = GetSingleUserMySQL(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetUserListing",
                str_file="get_user_listing"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_get_single_user(self, str_is_user):
        dict_get_single_user = self.my_sql.get_single_user(str_is_user)
        return dict_get_single_user


class GetSingleUserMySQL:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetSingleUserMySQL",
                str_file="get_single_user"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def get_single_user(self, str_user_id):
        str_function_name = "get_single_user"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return["bool_user_found"] = False
        dict_return['arr_user_info'] = dict()
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_users',
                                                        columns=['first_name', 'sur_name', 'user_name', 'id_name_prefix',
                                                                 'id_name_suffix', 'id_name_position',
                                                                 'user_enabled', 'password_change_required'],
                                                        conditions=[['id_user', '=', str_user_id]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Check That One Row Or More Was Received
                list_data = dict_result_query['list_data'][0]
                self.__log__(str_function_name, "Row Received (Good)")
                dict_return["bool_user_found"] = True
                dict_user = dict()
                dict_user['user_name'] = list_data[2]
                dict_user['first_name'] = list_data[0]
                dict_user['sur_name'] = list_data[1]
                dict_user['id_prefix'] = list_data[3]
                dict_user['id_suffix'] = list_data[4]
                dict_user['id_position'] = list_data[5]
                dict_user['bool_enabled'] = list_data[6]
                dict_user['bool_pass_change'] = list_data[7]
                dict_return['arr_user_info'] = dict_user
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Users")
                dict_return["bool_user_found"] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return
