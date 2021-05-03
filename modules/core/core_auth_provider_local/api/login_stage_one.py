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
import cherrypy
from database import Database
from global_vars import GlobalVars


class LoginStageOne:
    database: Database
    dict_database: dict
    float_random_wait_time = 0.0

    def __init__(self, dict_database: dict):
        self.dict_database = dict_database
        self.database = Database(dict_database)
        self.float_random_wait_time = random.uniform(0.05, 0.5)

    def main(self, str_username, str_ip_address):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        dict_return['local_auth'] = True
        dict_return['bool_provider_enabled'] = True
        dict_return['bool_provider_found'] = True
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
            dict_lookup_user = self.lookup_user(str_username)
            if dict_lookup_user['bool_error']:
                raise Exception(str(dict_lookup_user['str_status']))
            if dict_lookup_user['bool_user_found']:
                self.update_logon_session(dict_lookup_user['id_user'],
                                          dict_read_cookies['str_login_id'],
                                          dict_read_cookies['str_csrf_token'])
                dict_lookup_provider = self.lookup_provider(dict_lookup_user['id_provider'])
                if not dict_lookup_provider['bool_error']:
                    raise Exception(str(dict_lookup_provider['str_status']))
                if not dict_lookup_provider['bool_provider_enabled']:
                    dict_return['bool_provider_enabled'] = False
                if not dict_lookup_provider['bool_provider_found']:
                    dict_return['bool_provider_found'] = False
            else:
                sleep(self.float_random_wait_time)
        except Exception as e:
            dict_return['bool_error'] = False
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
                dict_return['str_status'] = """Imagine that you have zero cookies and you split them evenly among zero 
                friends. How many cookies does each person get? See? It doesn’t make sense. And Cookie Monster is sad 
                that there are no cookies, and you are sad that you have no friends.
                (Some or All Cookie Missing)"""
        except Exception as e:
            dict_return["bool_error"] = True
            dict_return['str_status'] = str(e)
        return dict_return

    def lookup_user(self, str_username):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        dict_return['bool_user_found'] = False
        dict_return['id_provider'] = ""
        dict_return['id_user'] = ""
        try:
            dict_select_user = self.database.select_data("SELECT id_provider, id_user FROM auth_users WHERE username = "
                                                         "%s", [str_username, ])
            if dict_select_user['bool_error']:
                raise Exception(str(dict_select_user['str_status']))
            if dict_select_user['int_row_count'] == 1:
                dict_user_data: dict = dict_select_user['arr_rows'][0]
                dict_return['bool_user_found'] = True
                dict_return['id_provider'] = dict_user_data[0]
                dict_return['id_user'] = dict_user_data[1]
            elif dict_select_user['int_row_count'] > 1:
                raise Exception("More than one User Returned. This is not good. Check for SQL Injections.")
        except Exception as e:
            dict_return['bool_error'] = True
            dict_return['str_status'] = str(e)
        return dict_return

    def lookup_provider(self, str_id_provider):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        dict_return['bool_provider_found'] = False
        dict_return['str_provider_type'] = ""
        dict_return['bool_provider_enabled'] = False
        dict_return['provider_data'] = ""
        try:
            dict_select_provider = self.database.select_data("SELECT type, enabled, provider_data FROM auth_providers "
                                                             "WHERE id_provider = %s", [str_id_provider, ])
            if dict_select_provider['bool_error']:
                raise Exception(str(dict_select_provider['str_status']))
            if dict_select_provider['int_row_count'] == 1:
                dict_provider: dict = dict_select_provider['arr_rows'][0]
                dict_return['bool_provider_found'] = True
                dict_return['str_provider_type'] = dict_provider[0]
                dict_return['provider_data'] = dict_provider[2]
                if dict_provider[1] == 1:
                    dict_return['bool_provider_enabled'] = True
            elif dict_select_provider['int_row_count'] > 1:
                raise Exception("More than one Provider Returned. This is not good. Check for SQL Injections.")
        except Exception as e:
            dict_return['bool_error'] = True
            dict_return['str_status'] = str(e)
        return dict_return

    def update_logon_session(self, str_user_id, str_id_logon_session, str_id_csrf_token):
        try:
            dict_update = self.database.update_data("UPDATE logon_session SET id_user = %s WHERE "
                                                    "id_logon_session = %s AND csrf_token = %s",
                                                    [str_user_id, str_id_logon_session, str_id_csrf_token])
            print(dict_update)
        except Exception as e:
            print(e)
