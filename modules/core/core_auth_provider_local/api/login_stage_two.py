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
import datetime
import random
from time import sleep

import bcrypt
import cherrypy

from database import Database
from global_vars import GlobalVars

class LoginStageTwo:
    database: Database
    dict_database: dict
    float_random_wait_time = 0.0

    def __init__(self, dict_database: dict):
        self.dict_database = dict_database
        self.database = Database(dict_database)
        self.float_random_wait_time = random.uniform(0.05, 0.5)

    def main(self, str_password, str_ip_address):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        try:
            dict_read_cookies: dict = self.read_cookies()
            if dict_read_cookies['bool_error']:
                raise Exception(str(dict_read_cookies['str_status']))
            if not dict_read_cookies['cookies_exist']:
                raise Exception("No Valid Login Session Found")
            dict_validate_logon_session: dict = self.validate_logon_session(dict_read_cookies['str_login_id'],
                                                                            dict_read_cookies['str_csrf_token'],
                                                                            str_ip_address)
            if dict_validate_logon_session['bool_error']:
                raise Exception(str(dict_validate_logon_session['str_status']))
            if not dict_validate_logon_session['bool_valid_session']:
                raise Exception("No Valid Logon Session Found")
        except Exception as e:
            dict_return['bool_error'] = False
            dict_return['str_status'] = str(e)
        return dict_return

    @staticmethod
    def read_cookies():
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_status'] = None
        dict_return['cookies_exist'] = True
        dict_return['str_login_id'] = None
        dict_return['str_csrf_token'] = None
        try:
            cookie = cherrypy.request.cookie
            for name in cookie.keys():
                if name == 'login_session':
                    dict_return['str_login_id'] = cookie[name].value
                elif name == 'csrf_token':
                    dict_return['str_csrf_token'] = cookie[name].value
            if dict_return['str_login_id'] is None or dict_return['str_csrf_token'] is None:
                dict_return["cookies_exist"] = False
                dict_return['str_status'] = """Imagine that you have zero cookies and you split them evenly among zero friends. How many cookies does each person get? See? It doesn’t make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends.
                (Some or All Cookie Missing)"""
        except Exception as e:
            dict_return["bool_error"] = True
            dict_return['str_status'] = str(e)
        return dict_return

    def validate_logon_session(self, str_login_id, str_csrf_token, str_ip_address):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        dict_return['bool_valid_session'] = False
        try:
            dict_db_result = self.database.select_data("SELECT date_time_start FROM logon_session "
                                                       "WHERE id_logon_session = %s AND "
                                                       "csrf_token = %s AND ip_address = %s",
                                                       [str_login_id, str_csrf_token, str_ip_address])
            if dict_db_result['bool_error']:
                raise Exception(str(dict_db_result['str_status']))
            if not dict_db_result['bool_success']:
                raise Exception("Unknown Error Querying Database.")
            if dict_db_result['int_row_count'] > 1:
                raise Exception("Received More Results that Expected or Allowed.")
            current_utc = datetime.datetime.utcnow()
            session_start_utc = dict_db_result['arr_rows'][0][0]
            datetime_object = datetime.datetime.strptime(session_start_utc, '%Y-%m-%d %H:%M:%S.%f')
            difference = (current_utc - datetime_object).total_seconds()
            if int(difference) <= GlobalVars.Sessions.login_session_time_limit:
                dict_return['bool_valid_session'] = True
        except Exception as e:
            dict_return['bool_error'] = True
            dict_return['str_status'] = str(e)
        return dict_return
