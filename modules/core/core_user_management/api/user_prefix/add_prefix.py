from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class AddPrefix:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = AddPrefixMySql(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="AddPrefix",
                str_file="user_prefix/add_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_add_prefix(self, str_prefix):
        dict_return = dict()
        dict_return['str_error_text'] = None
        dict_return["bool_error"] = False
        dict_return["bool_exists"] = False
        dict_return['bool_prefix_inserted'] = False
        dict_check_if_exists = self.my_sql.check_if_prefix_exists(str_prefix)
        if dict_check_if_exists['bool_error']:
            dict_return['str_error_text'] = dict_check_if_exists['str_error_text']
            dict_return["bool_error"] = True
            return dict_return
        if dict_check_if_exists["bool_exists"]:
            dict_return['bool_exists'] = True
            return dict_return
        dict_add_prefix = self.my_sql.add_prefix(str_prefix)
        if dict_add_prefix['bool_error']:
            dict_return['str_error_text'] = dict_add_prefix['str_error_text']
            dict_return["bool_error"] = True
            return dict_return
        dict_return['bool_prefix_inserted'] = dict_add_prefix['bool_prefix_inserted']
        return dict_return


class AddPrefixMySql:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="AddPrefixMySql",
                str_file="user_prefix/add_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def check_if_prefix_exists(self, str_prefix):
        str_function_name = "check_if_prefix_exists"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_exists'] = False
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_user_prefix',
                                                        columns=['id_user_prefix'],
                                                        conditions=[['user_prefix_text', '=', str_prefix]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count >= 1:  # Check That One Row Or More Was Received
                self.__log__(str_function_name, "Rows Received (Good)")
                dict_return["bool_exists"] = True
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Prefix")
                dict_return["bool_exists"] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return

    def add_prefix(self, str_prefix):
        str_function_name = "add_prefix"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_prefix_inserted'] = False
        try:
            str_id_prefix = str(uuid4())
            self.__log__(str_function_name, "Initializing MySQL Connection")
            dict_result_query = self.my_sql.insert_data(table_name='core_authentication_user_prefix',
                                                        columns=['id_user_prefix', 'user_prefix_text'],
                                                        values=[str_id_prefix, str_prefix])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Got One Row as Expected
                self.__log__(str_function_name, "Success 1 Row Added")
                dict_return['bool_prefix_inserted'] = True
            else:
                self.__log__(str_function_name, "More or less that 1 row added")
                dict_return["bool_error"] = True
                dict_return['str_error_text'] = 'Unknown Error Inserting Prefix'
                dict_return['bool_prefix_inserted'] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = "Error in Database Function. Error ID: {}".format(str_error_id)
            self.__log__(str_function_name, e, 'error', str_error_id)
        return dict_return
