from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class ChangeSuffix:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "ChangeSuffix")
        self.my_sql = ChangeSuffixMySql(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="ClassName",
                str_file="user_suffix/change_suffix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_change_suffix(self, str_suffix_id, str_suffix_text):
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return["bool_exists"] = False
        dict_return["bool_changed"] = False
        # Check User Permissions
        dict_check_if_suffix_exists = self.my_sql.check_if_suffix_exists(str_suffix_text)
        if dict_check_if_suffix_exists['bool_error']:
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = dict_check_if_suffix_exists['str_error_text']
            return dict_return
        if dict_check_if_suffix_exists['bool_exists']:
            dict_return['bool_exists'] = True
            return dict_return
        dict_change_suffix = self.my_sql.change_suffix(str_suffix_id, str_suffix_text)
        if dict_change_suffix['bool_error']:
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = dict_change_suffix['str_error_text']
            return dict_return
        dict_return["bool_changed"] = dict_change_suffix['bool_updated']
        return dict_return


class ChangeSuffixMySql:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="ChangeSuffixMySql",
                str_file="user_suffix/change_suffix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def check_if_suffix_exists(self, str_suffix_text):
        str_function_name = "check_if_suffix_exists"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_exists'] = False
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_user_suffix',
                                                        columns=['id_user_suffix'],
                                                        conditions=[['user_suffix_text', '=', str_suffix_text]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count >= 1:  # Check That One Row Or More Was Received
                self.__log__(str_function_name, "Rows Received (Good)")
                dict_return["bool_exists"] = True
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Users")
                dict_return["bool_exists"] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return

    def change_suffix(self, str_suffix_id, str_suffix_text):
        str_function_name = "change_suffix"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_updated'] = False
        try:
            self.__log__(str_function_name, "Initializing MySQL Connection")
            dict_result_query = self.my_sql.update_data(table_name='core_authentication_user_suffix',
                                                        column_value_pair=[['user_suffix_text', str_suffix_text]],
                                                        conditions=[['id_user_suffix', '=', str_suffix_id]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Got One Row as Expected
                self.__log__(str_function_name, "Success 1 Row Added")
                dict_return['bool_updated'] = True
            else:
                self.__log__(str_function_name, "More or less that 1 row added")
                dict_return["bool_error"] = True
                dict_return['str_error_text'] = 'Unknown Error Updating Suffix'
                dict_return['bool_updated'] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = "Error in Database Function. Error ID: {}".format(str_error_id)
            self.__log__(str_function_name, e, 'error', str_error_id)
        return dict_return
