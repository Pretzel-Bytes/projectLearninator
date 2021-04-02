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

import toml
import string
import random
import logging
import logger
import os.path
from pathlib import Path

validate_logger: logger

def key_generator(size=random.randint(50, 60), chars=string.ascii_letters + string.digits):
    tmp = ''.join(random.choice(chars) for _ in range(size))
    tmp = tmp.replace('"', "!")
    tmp = tmp.replace("'", "#")
    return tmp


def validate(dict_item: dict, item_to_check: str, required_length: int, required_type: type, item_name: str):
    bool_valid_config = True
    validate_logger.debug("Validating: {}".format(item_name))
    try:
        if item_to_check in dict_item:
            if len(str(dict_item[item_to_check])) >= required_length:
                if type(dict_item[item_to_check]) == required_type:
                    pass
                else:
                    validate_logger.error(
                        "{} must be an {}".format(item_name, str(required_type)))
                    bool_valid_config = False
            else:
                validate_logger.error("{} is not long enough. Must be at least {} in length".format(item_name, required_length))
                bool_valid_config = False
        else:
            validate_logger.error("{} non existent in config.toml".format(item_name))
            bool_valid_config = False
    except Exception as e:
        validate_logger.error("Error checking {}: {}".format(item_name, str(e)))
        bool_valid_config = False
    return bool_valid_config


def setup_logging(dict_logging_config: dict):
    global validate_logger
    try:
        log_level = dict_logging_config['log_level']
        if log_level == "notset":
            logger.LOG_LEVEL = logging.NOTSET
        elif log_level == "debug":
            logger.LOG_LEVEL = logging.DEBUG
        elif log_level == "info":
            logger.LOG_LEVEL = logging.INFO
        elif log_level == "warning":
            logger.LOG_LEVEL = logging.WARNING
        elif log_level == "error":
            logger.LOG_LEVEL = logging.ERROR
        elif log_level == "critical":
            logger.LOG_LEVEL = logging.CRITICAL
        log_file: str = dict_logging_config['log_file']
        arr_log_file = log_file.split("/")
        if len(arr_log_file) > 1:
            del arr_log_file[-1]
            str_path = '/'.join(arr_log_file)
            if not os.path.exists(str_path):
                path = Path(str_path)
                path.mkdir(parents=True)
        logger.LOG_FILE = log_file
        validate_logger = logger.get_logger('main.read_configuration.validate_config.validate')
        return True
    except Exception as e:
        print("Error Setting Up Logging: {}".format(str(e)))
        print("Example")
        print("[logging]")
        print('log_level = "debug"')
        print('log_file = "logs/app.log"')
        print("create_directory = true")
        return False


def validate_config_web_server(dict_webserver_config: dict):
    my_logger = logger.get_logger('main.read_configuration.validate_config.validate_config_web_server')
    my_logger.debug('Validate Configuration')
    bool_valid_config = True
    if not validate(dict_webserver_config, 'listen_address', 7, str, "webserver['listen_address']"):
        bool_valid_config = False
    if not validate(dict_webserver_config, 'listen_port', 1, int, "webserver['listen_port']"):
        bool_valid_config = False
    if not validate(dict_webserver_config, 'access_url', 14, str, "webserver['access_url']"):
        bool_valid_config = False
    return bool_valid_config


def validate_database(dict_database: dict):
    my_logger = logger.get_logger('main.read_configuration.validate_config.validate_database')
    bool_valid_config = True
    try:
        # Ensure that sqlite and sqlserver are not both enabled
        bool_enabled = False
        if 'sqlite3' in dict_database and 'sqlServer' in dict_database:
            if 'enabled' in dict_database['sqlite3'] and 'enabled' in dict_database['sqlServer']:
                if dict_database['sqlite3']['enabled'] and dict_database['sqlServer']['enabled']:
                    my_logger.error("sqlite3 and sqlServer cannot both be enabled")
                    bool_valid_config = False
        if 'sqlite3' not in dict_database and 'sqlServer' not in dict_database:
            my_logger.error("No database exists in the config file")
            bool_valid_config = False
        if 'sqlite3' in dict_database:
            if not validate(dict_database['sqlite3'], 'enabled', 4, bool, "database.sqlite3['enabled']"):
                bool_valid_config = False
            if not dict_database['sqlite3']['enabled']:
                my_logger.info("sqlite3 is not enabled, skipping")
            else:
                bool_enabled = True
                if not validate(dict_database['sqlite3'], 'file_path', 1, str, "database.sqlite3['file_path']"):
                    bool_valid_config = False
        else:
            my_logger.info("sqlite3 does not exist in config, skipping")
        if 'sqlServer' in dict_database:
            if not validate(dict_database['sqlServer'], 'enabled', 4, bool, "database.sqlServer['enabled']"):
                bool_valid_config = False
                if not dict_database['sqlServer']['enabled']:
                    my_logger.info("sqlServer is not enabled, skipping")
                else:
                    bool_enabled = True
                    if not validate(dict_database['sqlServer'], 'server', 7, str, "database.sqlServer['server']"):
                        bool_valid_config = False
                    if not validate(dict_database['sqlServer'], 'port', 1, int, "database.sqlServer['port']"):
                        bool_valid_config = False
                    if not validate(dict_database['sqlServer'], 'db_name', 1, str, "database.sqlServer['db_name']"):
                        bool_valid_config = False
                    if not validate(dict_database['sqlServer'], 'db_user', 1, str, "database.sqlServer['db_user']"):
                        bool_valid_config = False
                    if not validate(dict_database['sqlServer'], 'db_password', 1, str, "database.sqlServer['db_password']"):
                        bool_valid_config = False
                    if not validate(dict_database['sqlServer'], 'db_type', 5, str, "database.sqlServer['db_type']"):
                        bool_valid_config = False
                    else:
                        if dict_database['sqlServer']['db_type'] not in ['mysql', 'mariadb', 'mssql', 'postgresql']:
                            my_logger.error("database.sqlServer['db_type'] not valid. Must be on of the following:"
                                            " 'mysql', 'mariadb', 'mssql', 'postgresql'")
                            bool_valid_config = False
        else:
            my_logger.info("sqlServer does not exist in config, skipping")
        if not bool_enabled:
            my_logger.error("No DB is Enabled. database is required.")
            bool_valid_config = False
    except Exception as e:
        my_logger.error("Error validating database config: {}".format(str(e)))
        bool_valid_config = False
    return bool_valid_config


def validate_config(dict_config: dict):
    bool_valid_config = True
    my_logger = logger.get_logger('main.read_configuration.validate_config')
    my_logger.debug('Validate Configuration')
    if 'webserver' in dict_config:
        if not validate_config_web_server(dict_config['webserver']):
            bool_valid_config = False
    else:
        my_logger.error("webserver non existent in config.toml")
        bool_valid_config = False
    if 'database' in dict_config:
        if 'sqlite3' not in dict_config['database'] and 'sqlServer' not in dict_config['database']:
            my_logger.error("No database config in config.toml")
            bool_valid_config = False
        else:
            if not validate_database(dict_config['database']):
                bool_valid_config = False
    else:
        my_logger.error("database non existent in config.toml")
        bool_valid_config = False
    return bool_valid_config


def read_configuration():
    dict_return = dict()
    dict_return['valid_config'] = True
    dict_return['dict_config'] = None
    try:
        data = toml.load("config.toml")
        if 'logging' not in data:
            print("config.toml does not have logging")
            print("Cannot Continue without logging")
            print("Example")
            print("[logging]")
            print('log_level = "debug"')
            print('log_file = "logs/app.log"')
            print("create_directory = true")
            exit(1)
        if setup_logging(data['logging']):
            my_logger = logger.get_logger('main.read_configuration')
            my_logger.debug('Logging Setup')
        else:
            print("Cannot Continue without logging")
            exit(1)
        if not validate_config(data):
            print("Invalid Configuration Data. Check Log")
            exit(2)
        else:
            print(data)

        bool_key_changed = False
        if 'misc' in data:
            if 'app_secret' in data['misc']:
                if len(data['misc']['app_secret']) < 50:
                    str_id = key_generator()
                    data['misc']['app_secret'] = str_id
                    bool_key_changed = True
            else:
                str_id = key_generator()
                data['misc']['app_secret'] = str_id
                bool_key_changed = True
        else:
            str_id = key_generator()
            data['misc']['app_secret'] = str_id
            bool_key_changed = True
        if bool_key_changed:
            write = toml.dumps(data)
            with open("config.toml", "w") as f:
                f.write(write)
        dict_return['valid_config'] = True
        dict_return['dict_config'] = data
    except Exception as e:
        print(e)
        dict_return['valid_config'] = False
    return dict_return
