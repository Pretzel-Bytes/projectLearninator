import bcrypt
from uuid import uuid4
from pretzelbytes_database.mysql import MySQL


class SaveUser:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = SaveUserMySql(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="SaveUser",
                str_file="save_user"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_save_user(self, str_first_name, str_last_name, str_username, str_password, bool_enabled,
                        bool_password_change, str_prefix, str_suffix, str_position, str_id_user, str_session_id):
        dict_return = dict()
        dict_return['str_error_text'] = None
        dict_return["bool_error"] = False
        dict_return['bool_first_name_valid'] = False
        dict_return['bool_first_name_valid'] = False
        dict_return['bool_user_exists'] = False

        try:
            dict_get_user_list = self.my_sql.check_username(str_username, str_id_user)
            if dict_get_user_list['bool_error']:
                dict_return['str_error_text'] = dict_get_user_list['str_error_text']
                dict_return["bool_error"] = True
                return dict_return
            if dict_get_user_list['bool_user_exists']:
                dict_return['bool_user_exists'] = True
            if len(str_first_name) < 2:
                dict_return['bool_first_name_valid'] = False
            else:
                dict_return['bool_first_name_valid'] = True
            if len(str_last_name) < 2:
                dict_return['bool_last_name_valid'] = False
            else:
                dict_return['bool_last_name_valid'] = True
            if dict_return['bool_user_exists'] or not dict_return['bool_first_name_valid'] or not dict_return['bool_last_name_valid']:
                return dict_return
            # Cool story Bro, let's save the user
            dict_insert_user = self.my_sql.save_user(str_first_name, str_last_name, str_username, str_password,
                                                     bool_enabled, bool_password_change, str_prefix, str_suffix,
                                                     str_position, str_id_user, str_session_id)
            print(dict_insert_user)
            if dict_insert_user['bool_error']:
                dict_return['str_error_text'] = dict_insert_user['str_error_text']
                dict_return["bool_error"] = True
                return dict_return
            if dict_insert_user['bool_user_saved']:
                dict_return['bool_user_saved'] = True
                return dict_return
            else:
                dict_return['str_error_text'] = "Unknown Error Saving User"
                dict_return["bool_error"] = True
                return dict_return
        except Exception as e:
            dict_return['str_error_text'] = e
            dict_return["bool_error"] = True
        return dict_return

    def password_validate(self, str_password):
        dict_return = dict()
        dict_return['str_error_text'] = None
        dict_return["bool_error"] = False
        dict_return['bool_password_valid'] = False
        return dict_return


class SaveUserMySql:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="SaveUserMySql",
                str_file="save_user"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def check_username(self, str_username, str_id_user):
        str_function_name = "check_username"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_user_exists'] = False
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            print("GO GO GO")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_users', columns=['id_user'],
                                                        conditions=[['user_name', '=', str_username], 'AND',
                                                                    ['id_user', '<>', str_id_user]])
            print(dict_result_query)
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count >= 1:  # Check That One Row Or More Was Received
                self.__log__(str_function_name, "Rows Received (User already exists)")
                dict_return['bool_user_exists'] = True
            elif int_row_count <= 0:
                self.__log__(str_function_name, "No Rows Returned, No Users")
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = str("Error in Database Function. Error ID: {}".format(str_error_id))
            self.__log__(str_function_name, str(e), 'error', str(str_error_id))
        return dict_return

    def save_user(self, str_first_name, str_last_name, str_username, str_password, bool_enabled,
                  bool_password_change, str_prefix, str_suffix, str_position, str_id_user, str_session_id):
        str_function_name = "save_user"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_user_saved'] = False
        try:
            if str_password != 'NULL':
                str_password = (str_id_user + str_password).encode('utf-8')
                salt = bcrypt.gensalt()
                hashed = bcrypt.hashpw(str_password, salt)

            self.__log__(str_function_name, "Initializing MySQL Connection")
            if str_prefix == 'NULL':
                str_prefix = None
            if str_suffix == 'NULL':
                str_suffix = None
            if str_position == 'NULL':
                str_position = None
            if str_password == 'NULL':
                dict_result_query = self.my_sql.update_data(table_name='core_authentication_users',
                                                            column_value_pair=[['user_name', str_username],
                                                                               ['user_enabled', bool_enabled],
                                                                               ['password_change_required', bool_password_change],
                                                                               ['first_name', str_first_name],
                                                                               ['sur_name', str_last_name],
                                                                               ['id_name_prefix', str_prefix],
                                                                               ['id_name_suffix', str_suffix],
                                                                               ['id_name_position', str_position],
                                                                               ['date_update', 'UTC_TIMESTAMP()']],
                                                            conditions=[['id_user', '=', str_id_user]])
            else:
                dict_result_query = self.my_sql.update_data(table_name='core_authentication_users',
                                                            column_value_pair=[['user_name', str_username],
                                                                               ['user_enabled', bool_enabled],
                                                                               ['password_change_required',
                                                                                bool_password_change],
                                                                               ['first_name', str_first_name],
                                                                               ['sur_name', str_last_name],
                                                                               ['id_name_prefix', str_prefix],
                                                                               ['id_name_suffix', str_suffix],
                                                                               ['id_name_position', str_position],
                                                                               ['password_hash', hashed],
                                                                               ['date_update', 'UTC_TIMESTAMP()']],
                                                            conditions=[['id_user', '=', str_id_user]])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Got One Row as Expected
                self.__log__(str_function_name, "Success 1 Row Added")
                dict_return['bool_user_saved'] = True
                if str_password != 'NULL':
                    self.insert_password_change(str_id_user, str_session_id)
            else:
                self.__log__(str_function_name, "More or less that 1 row added")
                dict_return["bool_error"] = True
                dict_return['str_error_text'] = 'Unknown Error Inserting User Session Key'
                dict_return['bool_user_inserted'] = False
        except Exception as e:
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = "Error in Database Function. Error ID: {}".format(str_error_id)
            self.__log__(str_function_name, e, 'error', str_error_id)
        return dict_return

    def insert_password_change(self, str_id_user, str_session_id):
        str_function_name = "insert_password_change"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_inserted'] = False
        try:
            str_change_id = str(uuid4())
            print(str_session_id)
            dict_result_insert = self.my_sql.run_custom_parameterized_query(str_query="INSERT INTO core_authentication_password_change_log(id_change_log, id_user_reset, id_user_changed, change_date_time)VALUES( %s,%s ,(SELECT id_user FROM core_authentication_sessions WHERE id_session = %s),UTC_TIMESTAMP());",
                                                                            list_parameters=[str_change_id, str_id_user,
                                                                                             str_session_id])
            dict_return['bool_error'] = dict_result_insert['bool_error']
            dict_return['str_error_text'] = dict_result_insert['str_error_text']
            int_row_count = dict_result_insert['int_row_count']
            print(dict_result_insert)
            if int_row_count == 1:  # Got One Row as Expected
                dict_return['bool_inserted'] = True
        except Exception as e:
            print(e)
            str_error_id = str(uuid4())
            dict_return["bool_error"] = True
            dict_return['str_error_text'] = "Error in Database Function. Error ID: {}".format(str_error_id)
            self.__log__(str_function_name, e, 'error', str_error_id)
        return dict_return
