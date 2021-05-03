import bcrypt
from uuid import uuid4
from pretzelbytes_database.mysql import MySQL


class CreateUser:
    my_logger = None
    my_sql = None

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")
        self.my_sql = CreateUserMySql(self.my_logger)

    def __log__(self, str_function, str_message, str_level="debug", str_class="CreateUser",
                str_file="create_user"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def start_create_user(self, str_first_name, str_last_name, str_username, str_password, bool_enabled,
                          bool_password_change, str_prefix, str_suffix, str_position):
        dict_return = dict()
        dict_return['str_error_text'] = None
        dict_return["bool_error"] = False
        dict_return['bool_first_name_valid'] = False
        dict_return['bool_first_name_valid'] = False
        dict_return['bool_user_exists'] = False

        try:
            dict_get_user_list = self.my_sql.check_username(str_username)
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
            # Cool story Bro, let's insert a user
            dict_insert_user = self.my_sql.insert_user(str_first_name, str_last_name, str_username, str_password, bool_enabled, bool_password_change, str_prefix, str_suffix, str_position)
            if dict_insert_user['bool_error']:
                dict_return['str_error_text'] = dict_insert_user['str_error_text']
                dict_return["bool_error"] = True
                return dict_return
            if dict_insert_user['bool_user_inserted']:
                dict_return['bool_user_created'] = True
                return dict_return
            else:
                dict_return['str_error_text'] = "Unknown Error Adding User"
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


class CreateUserMySql:
    my_logger = None
    my_sql = MySQL()

    def __init__(self, my_logger):
        self.my_logger = my_logger
        self.__log__("Initialization", "Initialized")

    def __log__(self, str_function, str_message, str_level="debug", str_class="CreateUserMySql",
                str_file="create_user"):
        # str_level = ['debug', 'error', 'critical']
        if str_level == 'debug':
            self.my_logger.debug("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'error':
            self.my_logger.error("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))
        if str_level == 'critical':
            self.my_logger.critical("{}.{}.{} | {}".format(str_file, str_class, str_function, str_message))

    def check_username(self, str_username):
        str_function_name = "check_username"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_user_exists'] = False
        try:
            self.__log__(str_function_name, "Initialize MySQL Connection")
            dict_result_query = self.my_sql.select_data(table_name='core_authentication_users', columns=['id_user'],
                                                        conditions=[['user_name', '=', str_username]])
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

    def insert_user(self, str_first_name, str_last_name, str_username, str_password, bool_enabled,
                    bool_password_change, str_prefix, str_suffix, str_position):
        str_function_name = "insert_user"
        self.__log__(str_function_name, "Started")
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_error_text'] = None
        dict_return['bool_user_inserted'] = False
        try:
            str_id_user = str(uuid4())
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
            dict_result_query = self.my_sql.insert_data(table_name='core_authentication_users',
                                                        columns=['id_user', 'user_name', 'password_hash',
                                                                 'user_enabled', 'date_created', 'date_update',
                                                                 'password_change_required', 'first_name', 'sur_name',
                                                                 'id_name_prefix', 'id_name_suffix', 'id_name_position'],
                                                        values=[str_id_user, str_username, hashed, bool_enabled,
                                                                'UTC_TIMESTAMP()', 'UTC_TIMESTAMP()',
                                                                bool_password_change, str_first_name, str_last_name,
                                                                str_prefix, str_suffix, str_position])
            dict_return['bool_error'] = dict_result_query['bool_error']
            dict_return['str_error_text'] = dict_result_query['str_error_text']
            int_row_count = dict_result_query['int_row_count']
            if int_row_count == 1:  # Got One Row as Expected
                self.__log__(str_function_name, "Success 1 Row Added")
                dict_return['bool_user_inserted'] = True
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
