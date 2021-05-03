from pretzelbytes_database.mysql import MySQL
from uuid import uuid4


class DeletePrefix:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "DeletePrefix")
        self.my_sql = DeletePrefixMySql(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="ClassName",
                str_file="user_prefix/delete_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_delete_prefix(self, str_prefix_id):
        return self.my_sql.delete_prefix(str_prefix_id)


class DeletePrefixMySql:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="DeletePrefixMySql",
                str_file="user_prefix/change_prefix"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def delete_prefix(self, str_prefix_id):
        str_function_name = "delete_prefix"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_deleted'] = False
        try:
            self.__log__(str_function_name, "Initializing MySQL Connection")
            dict_result_query = self.my_sql.delete_data(table_name='core_authentication_user_prefix',
                                                        conditions=[['id_user_prefix', '=', str_prefix_id]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Got One Row as Expected
                self.__log__(str_function_name, "Success 1 Row Deleted")
                dict_return['bool_deleted'] = True
                self.remove_from_users(str_prefix_id)
            else:
                self.__log__(str_function_name, "More or less that 1 row deleted")
                dict_return["bool_error"] = True
                dict_return['str_error_text'] = 'Unknown Error Deleting Prefix'
                dict_return['bool_deleted'] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = "Error in Database Function. Error ID: {}".format(str_error_id)
            self.__log__(str_function_name, e, 'error', str_error_id)
        return dict_return

    def remove_from_users(self, str_prefix_id):
        str_function_name = "remove_from_users"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        try:
            self.__log__(str_function_name, "Initializing MySQL Connection")
            dict_result_query = self.my_sql.update_data(table_name='', column_value_pair=[['id_name_prefix', '']],
                                                        conditions=[['id_name_prefix', '=', str_prefix_id]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = "Error in Database Function. Error ID: {}".format(str_error_id)
            self.__log__(str_function_name, e, 'error', str_error_id)
        return dict_return
