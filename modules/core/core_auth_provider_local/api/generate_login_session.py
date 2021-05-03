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
import string
import cherrypy
from database import Database
from global_vars import GlobalVars

class GenerateLoginSession:
    database: Database
    dict_database: dict
    def __init__(self, dict_database: dict):
        self.dict_database = dict_database
        self.database = Database(dict_database)

    def main(self, str_ip_address):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        dict_return['bool_login_session_created'] = False
        dict_return['str_utc_time_created'] = ""
        try:
            str_login_id = ''.join(random.choices(string.ascii_letters + string.digits, k=255))
            str_csrf_token = ''.join(random.choices(string.ascii_letters + string.digits, k=255))
            dict_insert_login_session = self.insert_login_session(str_login_id, str_csrf_token, str_ip_address)
            if dict_insert_login_session['bool_error']:
                raise Exception(dict_insert_login_session['str_status'])
            if dict_insert_login_session['bool_inserted']:
                dict_create_cookie = self.create_cookie(str_login_id, str_csrf_token)
                if dict_create_cookie['bool_error']:
                    raise Exception(str(dict_create_cookie['str_status']))
                if dict_create_cookie['bool_cookie_created']:
                    dict_return['bool_login_session_created'] = True
                    dict_return['str_utc_time_created'] = dict_insert_login_session['str_utc_time_created']
        except Exception as e:
            dict_return['bool_error'] = False
            dict_return['str_status'] = str(e)
        return dict_return

    def insert_login_session(self, str_id_logon_session, str_csrf_token, str_ip_address):
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_status'] = ""
        dict_return['bool_inserted'] = False
        dict_return['str_utc_time_created'] = ""
        try:
            current_utc = datetime.datetime.utcnow()
            dict_db_result = self.database.insert_data("INSERT INTO logon_session('id_logon_session', 'date_time_start',"
                                                       " 'csrf_token', 'ip_address') VALUES(%s,%s,%s,%s)",
                                                       [str_id_logon_session, current_utc, str_csrf_token, str_ip_address])
            if dict_db_result['bool_error']:
                raise Exception(str(dict_db_result['str_status']))
            if dict_db_result['bool_success'] and dict_db_result['int_row_count'] == 1:
                dict_return['bool_inserted'] = True
                dict_return['str_utc_time_created'] = str(current_utc)
        except Exception as e:
            dict_return['bool_error'] = False
            dict_return['str_status'] = str(e)
        return dict_return

    @staticmethod
    def create_cookie(str_id_login_session, str_csrf_token):
        dict_return = dict()
        dict_return["bool_error"] = False
        dict_return['str_status'] = None
        dict_return["bool_cookie_created"] = False
        try:
            cookie = cherrypy.response.cookie
            cookie['login_session'] = str_id_login_session
            cookie['login_session']['path'] = '/'
            cookie['login_session']['httponly'] = True
            cookie['login_session']['max-age'] = GlobalVars.Sessions.login_session_time_limit
            cookie['login_session']['SameSite'] = "Strict"
            cookie['csrf_token'] = str_csrf_token
            cookie['csrf_token']['path'] = '/'
            cookie['csrf_token']['httponly'] = True
            cookie['csrf_token']['max-age'] = GlobalVars.Sessions.login_session_time_limit
            cookie['csrf_token']['SameSite'] = "Strict"
            dict_return["bool_cookie_created"] = True
        except Exception as e:
            dict_return["bool_error"] = True
            dict_return['str_status'] = e
        return dict_return