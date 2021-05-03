from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class GetUserSuffixList:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = GetUserSuffixListMySQL(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetUserSuffixList",
                str_file="user_suffix/get_user_suffix_list"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_get_listing(self):
        return self.my_sql.get_suffix()


class GetUserSuffixListMySQL:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetUserSuffixListMySQL",
                str_file="user_suffix/get_user_suffix_list"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def get_suffix(self):
        str_function_name = "get_suffix"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['arr_suffix'] = []
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_user_suffix',
                                                        columns=['id_user_suffix', 'user_suffix_text'], conditions=[])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count >= 1:  # Check That One Row Or More Was Received
                list_data = dict_result_query['list_data']
                self.__log__(str_function_name, "Rows Received (Good)")
                for row in list_data:
                    dict_prefix = dict()
                    dict_prefix['id'] = row[0]
                    dict_prefix['text'] = row[1]
                    dict_return['arr_suffix'].append(dict_prefix)
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Prefixes")
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return
