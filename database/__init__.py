#  MIT License
#
#  Copyright (c) 2021 Pretzel Bytes LLC
#
#  Permission is hereby granted, free of charge, to any person obtaining a copy
#  of this software and associated documentation files (the "Software"), to deal
#  in the Software without restriction, including without limitation the rights
#  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#  copies of the Software, and to permit persons to whom the Software is
#  furnished to do so, subject to the following conditions:
#
#  The above copyright notice and this permission notice shall be included in all
#  copies or substantial portions of the Software.
#
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#  SOFTWARE

class Database:
    str_database_type: str = ""
    database = None
    dict_config: dict
    bool_isSQLite: bool = False
    bool_db_startup_success = True

    def __init__(self, dict_config: dict, bool_startup: bool = False):
        self.dict_config = dict_config
        if dict_config["sqlite3"]["enabled"]:
            self.bool_isSQLite = True
            self.str_database_type = "sqlite3"
            from database.sqlite3 import SqLite3
            self.database: SqLite3 = SqLite3(dict_config["sqlite3"]["file_path"], bool_startup)
            if self.database.bool_startup_success is False:
                self.bool_db_startup_success = False

    def insert_data(self, str_insert_statement: str, arr_values: list):
        return self.database.insert_data(str_insert_statement, arr_values)

    def update_data(self, str_update_statement: str, arr_values: list):
        return self.database.update_data(str_update_statement, arr_values)

    def delete_data(self, str_delete_statement: str, arr_values: list):
        return self.database.delete_data(str_delete_statement, arr_values)

    def select_data(self, str_select_statement: str, arr_values: list):
        return self.database.select_data(str_select_statement, arr_values)
