#  __author__ = "Michael Pretzel | Pretzel Bytes LLC"
#  __copyright__ = "Copyright 2021"
#  __license__ = "Proprietary"
#  __version__ = 2021.2.20
import cherrypy
#from cherrypy._cpnative_server import CPHTTPServer
import json
import os
from database import Database


class CherryPy:
    str_listen_address: str = "0.0.0.0"
    int_listen_port: int = 80
    str_access_url: str = "127.0.0.1"
    str_root_directory = os.getcwd()
    str_cherry_py_config = {"/":{}}
    str_error_log = "error.log"
    str_access_log = "access.log"
    database: Database
    def __init__(self, dict_config: dict, database: Database):
        self.database = database
        self.str_listen_address = dict_config['listen_address']
        self.str_access_url = dict_config['access_url']
        self.int_listen_port = dict_config['listen_port']
        self.str_access_log = dict_config['access_log']
        self.str_error_log = dict_config['error_log']
        self.configure_cherry_py()
        self.setup_static_root()
        self.setup_apis()
        self.run_cherry_py()

    def error_page_405(self, status, message, traceback, version):
        cherrypy.response.status = 405
        dict_return = dict()
        dict_return['bool_error'] = True
        dict_return['str_error_text'] = dict()
        dict_return['str_error_text']['message'] = message
        dict_return['str_error_text']['status'] = status
        return json.dumps(dict_return)

    def error_page_404(self, status, message, traceback, version):
        cherrypy.response.status = 404
        dict_return = dict()
        dict_return['bool_error'] = True
        dict_return['str_error_text'] = dict()
        dict_return['str_error_text']['message'] = message
        dict_return['str_error_text']['status'] = status
        return json.dumps(dict_return)

    def error_page_500(self, status, message, traceback, version):
        cherrypy.response.status = 500
        dict_return = dict()
        dict_return['bool_error'] = True
        dict_return['str_error_text'] = dict()
        dict_return['str_error_text']['message'] = message
        dict_return['str_error_text']['status'] = status
        return json.dumps(dict_return)

    # Web root where the html, css, js, ect is stored. Nothing is done in Python
    class StaticRoot(object):
        pass


    def configure_cherry_py(self):
        cherrypy.config.update({
            'global': {
                'engine.autoreload.on': False,
                'response.headers.server': '',
                'server.socket_host': self.str_listen_address,
                'server.socket_port': int(self.int_listen_port),
                'log.screen': True,
                'log.access_file': self.str_access_log,
                'log.error_file': self.str_error_log,
                # 'request.error_response': self.error_page_500,
            },

        })

    def setup_static_root(self):
        json_root_config = {"/":
            {
                'tools.staticdir.on': True,
                'tools.staticdir.dir': os.path.join(self.str_root_directory, 'web_static_content'),
                'tools.staticdir.index': 'index.html',
                'tools.gzip.on': True,
                'tools.expires.on': True,
                'tools.expires.secs': 3600  # expire in an hour
            }
        }
        cherrypy.tree.mount(self.StaticRoot(), '/', config=json_root_config)

    def setup_apis(self):
        pass
        # cherrypy.tree.mount(biServerMain(self.database), '/api/v1/biServer',
        #                     config=self.str_cherry_py_config)
        # cherrypy.tree.mount(Authentication(self.database), '/api/v1/authentication',
        #                     config=self.str_cherry_py_config)

    def run_cherry_py(self):
        #cherrypy.server.httpserver = CPHTTPServer(cherrypy.server)
        # cherrypy.response.headers["Access-Control-Allow-Origin"] = self.str_access_url
        # cherrypy.config.update({'error_page.405': self.error_page_405})
        # cherrypy.config.update({'error_page.404': self.error_page_404})
        # cherrypy.config.update({'error_page.500': self.error_page_500})
        # cherrypy.thread_pool = 100
        cherrypy.engine.start()
        cherrypy.engine.block()