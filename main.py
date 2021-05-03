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

import logger
import configure
from os import getcwd
from database import Database
from cherryPy import CherryPy
from modules import LoadCoreModules
from global_vars import GlobalVars


def main():
    # my_logger = logger.get_logger('main')
    # my_logger.debug('Main Started')
    dict_read_config = configure.read_configuration()
    if dict_read_config['valid_config']:
        dict_config:dict = dict_read_config['dict_config']
        my_logger = logger.get_logger('main')
        my_logger.debug('Configuration File is Syntactically Correct')
        database: Database = Database(dict_config['database'], True)
        if database.bool_db_startup_success:
            dict_session_limits = dict_config['webserver']['session_limits']
            GlobalVars.Sessions.login_session_time_limit = dict_session_limits['login_session_time_limit']
            GlobalVars.Sessions.user_session_idle_time_limit_remember_me = dict_session_limits['user_session_idle_time_limit_remember_me']
            GlobalVars.Sessions.user_session_idle_time_limit = dict_session_limits['user_session_idle_time_limit']
            LoadCoreModules(getcwd(), dict_config['database'])
            CherryPy(dict_config['webserver'], database)

        else:
            print("FUCK")
            exit(1)
    else:
        print("Error Reading Configuration File")
        exit(3)
    #print(my_logger.parent)


if __name__ == "__main__":
    main()