from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class GetUserListing:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = GetUserListingMySQL(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetUserListing",
                str_file="get_user_listing"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_get_listing(self):
        dict_get_user_list = self.my_sql.get_users()
        return dict_get_user_list


class GetUserListingMySQL:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetUserListingMySQL",
                str_file="get_user_listing"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def get_users(self):
        str_function_name = "get_users"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['arr_users'] = []
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.run_custom_parameterized_query(str_query="""SELECT id_user, user_name, user_enabled, password_change_required, first_name, sur_name, (SELECT user_prefix_text FROM core_authentication_user_prefix WHERE id_user_prefix = id_name_prefix) AS 'name_prefix', (SELECT user_suffix_text FROM core_authentication_user_suffix WHERE id_user_suffix = id_name_suffix) AS 'name_suffix', (SELECT user_position_text FROM core_authentication_user_position WHERE id_user_position = id_name_position) 'user_position' FROM core_authentication_users ORDER BY sur_name ASC""", list_parameters=[])
            # self.my_sql.select_data(table_name='core_authentication_users',
            #                                             columns=['id_user', 'user_name',
            #                                                      'user_enabled', 'password_change_required',
            #                                                      'first_name', 'sur_name'],
            #                                             conditions=[])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count >= 1:  # Check That One Row Or More Was Received
                self.__log__(str_function_name, "Rows Received (Good)")
                for row in dict_result_query['list_data']:
                    dict_user = dict()
                    dict_user['id_user'] = row[0]
                    dict_user['user_name'] = row[1]
                    dict_user['user_enabled'] = row[2]
                    dict_user['password_change_required'] = row[3]
                    dict_user['first_name'] = row[4]
                    dict_user['sur_name'] = row[5]
                    dict_user['prefix'] = row[6]
                    dict_user['suffix'] = row[7]
                    dict_user['position'] = row[8]
                    dict_return['arr_users'].append(dict_user)
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Users")
                dict_return["bool_user_found"] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return
