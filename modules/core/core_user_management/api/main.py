import cherrypy
from database import Database

class UserManagement:
    dict_database: dict
    def __init__(self, dict_database: dict):
        self.dict_database = dict_database

    # START create_user
    @cherrypy.expose
    @cherrypy.tools.allow(methods='POST')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def create_user(self):
        pass
    # END create_user

    # START save_user
    @cherrypy.expose
    @cherrypy.tools.allow(methods='POST')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def save_user(self):
       pass

    # START get_user_listing
    @cherrypy.expose
    @cherrypy.tools.allow(methods='GET')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def get_user_listing(self):
        pass

    # START get_single_user
    @cherrypy.expose
    @cherrypy.tools.allow(methods='PUT')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def get_single_user(self):
        pass

    # User Pefix Functions

    # START user_prefix__get_prefix_listing
    @cherrypy.expose
    @cherrypy.tools.allow(methods='GET')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def user_prefix__get_prefix_listing(self):
        pass

    # START user_prefix__add_user_prefix
    @cherrypy.expose
    @cherrypy.tools.allow(methods='POST')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def user_prefix__add_user_prefix(self):
        pass

