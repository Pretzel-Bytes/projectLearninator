from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class GetSinglePrefix:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = GetSinglePrefixMySql(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetSinglePrefix",
                str_file="user_prefix/get_single_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_get_prefix(self, str_prefix_id):
        return self.my_sql.get_prefix(str_prefix_id)


class GetSinglePrefixMySql:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="GetSinglePrefixMySql",
                str_file="user_prefix/get_single_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def get_prefix(self, str_prefix_id):
        str_function_name = "get_prefix"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['str_id_prefix'] = ''
        dict_return['str_prefix_text'] = ''
        dict_return['bool_prefix_found'] = False
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_user_prefix',
                                                        columns=['id_user_prefix', 'user_prefix_text'],
                                                        conditions=[['id_user_prefix', '=', str_prefix_id]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Check That One Row Or More Was Received
                self.__log__(str_function_name, "Rows Received (Good)")
                list_data = dict_result_query['list_data'][0]
                dict_return['str_id_prefix'] = list_data[0]
                dict_return['str_prefix_text'] = list_data[1]
                dict_return['bool_prefix_found'] = True
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Prefix")
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return
