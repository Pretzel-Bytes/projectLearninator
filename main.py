import toml
import string, random
import logger
import logging


def key_generator(size=random.randint(50,60), chars=string.ascii_letters + string.digits + string.punctuation):
    tmp = ''.join(random.choice(chars) for _ in range(size))
    tmp = tmp.replace('"', "!")
    tmp = tmp.replace("'", "#")
    return tmp


def setup_logging(dict_logging_config:dict):
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
        log_file = dict_logging_config['log_file']
        logger.LOG_FILE = log_file
        return True
    except Exception as e:
        print("Error Setting Up Logging: {}". format(str(e)))
        print("Example")
        print("[logging]")
        print('log_level = "debug"')
        print('log_file = "logs\\app.log"')
        print("create_directory = true")
        return False

def validate_config_web_server(dict_webserver_config: dict):
    my_logger = logger.get_logger('main.read_configuration.validate_config.validate_config_web_server')
    my_logger.debug('Validate Configuration')
    bool_valid_config = True
    if 'listen_address' in dict_webserver_config:
        if len(dict_webserver_config['listen_address']) > 6:
            if type(dict_webserver_config['listen_address']) == str:
                pass
            else:
                my_logger.error(
                    "webserver['listen_address'] must be a string")
                bool_valid_config = False
        else:
            my_logger.error("webserver['listen_address'] is not long enough. Must be in IPv4 Format i.e 0.0.0.0")
            bool_valid_config = False
    else:
        my_logger.error("webserver['listen_address'] non existent in config.toml")
        bool_valid_config = False
    if 'listen_port' in dict_webserver_config:
        if len(dict_webserver_config['listen_address']) > 0:
            if type(dict_webserver_config['listen_port']) == int:
                pass
            else:
                my_logger.error(
                    "webserver['listen_port'] must be an int")
                bool_valid_config = False
        else:
            my_logger.error("webserver['listen_port'] is not long enough. Must be in integer Format i.e 80")
            bool_valid_config = False
    else:
        my_logger.error("webserver['listen_port'] non existent in config.toml")
        bool_valid_config = False
    if 'access_url' in dict_webserver_config:
        if len(dict_webserver_config['access_url']) > 13:
            if type(dict_webserver_config['access_url']) == str:
                pass
            else:
                my_logger.error(
                    "webserver['access_url'] must be a string")
                bool_valid_config = False
        else:
            my_logger.error("webserver['access_url'] is not long enough. Must be in url Format i.e http://127.0.0.1/")
            bool_valid_config = False
    else:
        my_logger.error("webserver['access_url'] non existent in config.toml")
        bool_valid_config = False
    return bool_valid_config

def validate_config(dict_config:dict):
    bool_valid_config = True
    my_logger = logger.get_logger('main.read_configuration.validate_config')
    my_logger.debug('Validate Configuration')
    if 'webserver' in dict_config:
        if validate_config_web_server(dict_config['webserver']) == False:
            bool_valid_config = False
    else:
        my_logger.error("webserver non existent in config.toml")
        bool_valid_config = False
    if 'database' in dict_config:
        if not 'sqlite3' in dict_config['database'] and not 'sqlServer' in dict_config['database']:
            my_logger.error("sqlite3 or sqlServer non existent in config.toml")
            bool_valid_config = False
    else:
        my_logger.error("database non existent in config.toml")
        bool_valid_config = False
    return bool_valid_config


def read_configuration():
    try:
        data = toml.load("conf.toml")
        if not 'logging' in data:
            print("conf.toml does not have logging")
            print("Cannot Continue without logging")
            print("Example")
            print("[logging]")
            print('log_level = "debug"')
            print('log_file = "logs\\app.log"')
            print("create_directory = true")
            exit(1)
        if setup_logging(data['logging']):
            my_logger = logger.get_logger('main.read_configuration')
            my_logger.debug('Logging Setup')
        else:
            print("Cannot Continue without logging")
            exit(1)
        validate_config(data)
        print(data)

        bool_key_changed = False
        if 'misc' in data:
            if 'app_secret' in data['misc']:
                if len(data['misc']['app_secret']) < 50:
                    id = key_generator()
                    data['misc']['app_secret'] = id
                    bool_key_changed = True
            else:
                id = key_generator()
                data['misc']['app_secret'] = id
                bool_key_changed = True
        else:
            id = key_generator()
            data['misc']['app_secret'] = id
            bool_key_changed = True
        print(data)
        if bool_key_changed:
            write = toml.dumps(data)
            with open("conf.toml", "w") as f:
                f.write(write)


    except Exception as e:
        print(e)

def main():
    # my_logger = logger.get_logger('main')
    # my_logger.debug('Main Started')
    read_configuration()
    my_logger = logger.get_logger('main')
    my_logger.debug('Configuration Loaded')
    #print(my_logger.parent)


if __name__ == "__main__":
    main()