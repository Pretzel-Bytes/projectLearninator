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
import mariadb as mdb
import logger


class MariaDB:
    connection_pool: mdb.ConnectionPool = None
    bool_startup: bool = False
    sqlite_logger: logger
    bool_startup_success = True

    def __init__(self, str_username: str, str_password: str, str_host: str,
                 int_port: int, str_database: str, str_pool_name: str, int_pool_size: int,
                 bool_startup: bool = False):
        try:
            self.bool_startup = bool_startup
            self.sqlite_logger = logger.get_logger('database.sqlserver.mariadb')
            if bool_startup:
                self.sqlite_logger.debug("Initializing mariadb Database")
            if self.create_connection(str_username, str_password, str_host, int_port, str_database, str_pool_name,
                                      int_pool_size):
                if bool_startup:
                    if not self.create_tables():
                        self.bool_startup_success = False
            else:
                self.bool_startup_success = False
        except Exception as e:
            print(e)

    def create_connection(self, str_username: str, str_password: str, str_host: str, int_port: int, str_database: str,
                          str_pool_name: str, int_pool_size: int):
        try:
            self.connection_pool = mdb.ConnectionPool(
                user=str_username,
                password=str_password,
                host=str_host,
                port=int_port,
                database=str_database,
                pool_name=str_pool_name,
                pool_size=int_pool_size,
                autocommit=True
            )
            return True
        except Exception as e:
            # print("Error Connecting to mariadb Database: {}".format(str(e)))
            self.sqlite_logger.error("Error Connecting to mariadb Database: {}".format(str(e)))
            return False

    def create_tables(self):
        self.sqlite_logger.debug("Creating Table if Not Existent")
        try:
            with open('database/mysql_create.sql', 'r') as sql_file:
                pconn = self.connection_pool.get_connection()
                script_file = sql_file.read().replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS").split(";")
                sql_script = script_file
                for s in sql_script:
                    try:
                        s = s.replace("\n", "").replace("\t", "")
                        cursor = pconn.cursor()
                        if len(s) > 5:
                            cursor.execute(s)
                    except Exception as e:
                        if 'errno: 121' in str(e):
                            pass
                        else:
                            raise e
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
            pconn = self.connection_pool.get_connection()
            cur = pconn.cursor()
            cur.execute(str_insert_statement, arr_values)
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
            pconn.close()
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
            pconn = self.connection_pool.get_connection()
            cur = pconn.cursor()
            cur.execute(str_update_statement, arr_values)
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
            pconn.close()
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
            pconn = self.connection_pool.get_connection()
            cur = pconn.cursor()
            cur.execute(str_delete_statement, arr_values)
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
            pconn.close()
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
            pconn = self.connection_pool.get_connection()
            cur = pconn.cursor()
            cur.execute(str_select_statement, arr_values)
            rows = cur.fetchall()
            dict_return['int_row_count']: int = len(rows)
            dict_return['bool_success']: bool = True
            dict_return['arr_rows'] = rows
            cur.close()
            pconn.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return
