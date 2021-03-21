#  __author__ = "Michael Pretzel | Pretzel Bytes LLC"
#  __copyright__ = "Copyright 2021"
#  __license__ = "Proprietary"
#  __version__ = 2021.2.6

class Database:
    str_database_type: str = ""
    database = None
    dict_config: dict
    bool_isSQLite: bool = False

    def __init__(self, dict_config: dict, bool_startup: bool = False):
        self.dict_config = dict_config
        if dict_config["sqlite3"]["enabled"]:
            self.bool_isSQLite = True
            self.str_database_type = "sqlite3"
            from database.sqlite3 import SqLite3
            self.database: SqLite3 = SqLite3(dict_config["sqlite3"]["file_path"], bool_startup)

    def insert_data(self, str_insert_statement: str, arr_values: list):
        return self.database.insert_data(str_insert_statement, arr_values)

    def update_data(self, str_update_statement: str, arr_values: list):
        return self.database.update_data(str_update_statement, arr_values)

    def delete_data(self, str_delete_statement: str, arr_values: list):
        return self.database.delete_data(str_delete_statement, arr_values)

    def select_data(self, str_select_statement: str, arr_values: list):
        return self.database.select_data(str_select_statement, arr_values)
