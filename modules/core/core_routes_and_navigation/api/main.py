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

from global_vars import GlobalVars
import cherrypy
from database import Database


class RoutesAndNavigation:
    database: Database
    def __init__(self, database: Database):
        self.database = database

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def get_routes(self):
        #self.my_logger.debug("Get Routes Started")
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_error_text'] = ''
        dict_return['arr_routes'] = []
        try:
            dict_return['arr_routes'] = GlobalVars.WebComponents.arr_routes
        except Exception as e:
            dict_return['bool_error'] = True
            dict_return['str_error_text'] = e
        return dict_return

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def get_navigation(self):
        #self.my_logger.debug("Get Navigation Started")
        dict_return = dict()
        dict_return['bool_error'] = False
        dict_return['str_error_text'] = ''
        dict_return['arr_no_children'] = []
        dict_return['arr_children'] = []
        try:
            for node in GlobalVars.WebComponents.arr_navigation:
                if 'children' not in node:
                    dict_return['arr_no_children'].append(node)
                else:
                    dict_return['arr_children'].append(node)
        except Exception as e:
            dict_return['bool_error'] = True
            dict_return['str_error_text'] = e
        return dict_return
