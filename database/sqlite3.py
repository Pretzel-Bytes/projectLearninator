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
import sqlite3
import logger


class SqLite3:
    connection: sqlite3.Connection = None
    bool_startup: bool = False
    sqlite_logger: logger
    bool_startup_success = True

    def __init__(self, str_db_file: str, bool_startup: bool = False):
        self.bool_startup = bool_startup
        self.sqlite_logger = logger.get_logger('database.sqlite3')
        if bool_startup:
            self.sqlite_logger.debug("Initializing sqlite3 Database")
        if self.create_connection(str_db_file):
            if bool_startup:
                if not self.create_tables():
                    self.bool_startup_success = False
        else:
            self.bool_startup_success = False

    def create_connection(self, str_db_file: str):
        try:
            if self.bool_startup:
                self.sqlite_logger.debug("Connecting to sqlite3 Database")
            conn = sqlite3.connect(str_db_file)
            if self.bool_startup:
                self.sqlite_logger.debug("Connected to sqlite3 Database, version: {}".format(str(sqlite3.version)))
            if conn:
                self.connection = conn
                return True
            else:
                self.sqlite_logger.error("Unknown Error Connecting to sqlite3 Database")
                return False
        except Exception as e:
            print("Error Creating or Connecting to sqlite3 Database: {}".format(str(e)))
            self.sqlite_logger.error("Error Connecting to sqlite Database: {}".format(str(e)))
            return False


    def create_tables(self):
        self.sqlite_logger.debug("Creating Table if Not Existent")
        try:
            with open('database/sqlite3_create.sql', 'r') as sql_file:
                sql_script = sql_file.read()
                cursor = self.connection.cursor()
                cursor.executescript(sql_script)
                self.connection.commit()
            self.sqlite_logger.debug("Tables Created  if Not Existent")
            return True
        except Exception as e:
            self.sqlite_logger.error("Error trying to create tables: {}".format(str(e)))
            return False


    def insert_data(self, str_insert_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        try:
            cur = self.connection.cursor()
            cur.execute(str_insert_statement, arr_values)
            self.connection.commit()
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def update_data(self, str_update_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        try:
            cur = self.connection.cursor()
            cur.execute(str_update_statement, arr_values)
            self.connection.commit()
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def delete_data(self, str_delete_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        try:
            cur = self.connection.cursor()
            cur.execute(str_delete_statement, arr_values)
            self.connection.commit()
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def select_data(self, str_select_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        dict_return['arr_rows']: list = []
        try:
            cur = self.connection.cursor()
            cur.execute(str_select_statement, arr_values)
            rows = cur.fetchall()
            dict_return['int_row_count']: int = len(rows)
            dict_return['bool_success']: bool = True
            dict_return['arr_rows'] = rows
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return
