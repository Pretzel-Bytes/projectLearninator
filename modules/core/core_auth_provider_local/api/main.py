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

#  MIT License
#
#
#  Permission is hereby granted, free of charge, to any person obtaining a copy
#  of this software and associated documentation files (the "Software"), to deal
#  in the Software without restriction, including without limitation the rights
#  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#  copies of the Software, and to permit persons to whom the Software is
#  furnished to do so, subject to the following conditions:
#
#
import cherrypy
from database import Database
from .generate_login_session import GenerateLoginSession
from .login_stage_one import LoginStageOne
from.login_stage_two import LoginStageTwo
class AuthProviderLocal:
    dict_database: dict
    database: Database
    def __init__(self, dict_database: dict):
        self.dict_database = dict_database
        self.database = Database(dict_database)

    @cherrypy.expose
    @cherrypy.tools.allow(methods='GET')
    @cherrypy.tools.json_out()
    def generate_login_session(self):
        dict_login_session = GenerateLoginSession(self.dict_database).main(cherrypy.request.remote.ip)
        return dict_login_session

    @cherrypy.expose
    @cherrypy.tools.allow(methods='POST')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def login_stage_one(self):
        data = cherrypy.request.json
        dict_login_session = LoginStageOne(self.dict_database).main(data['str_username'],
                                                                     cherrypy.request.remote.ip)
        return dict_login_session

    @cherrypy.expose
    @cherrypy.tools.allow(methods='POST')
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    def login_stage_two(self):
        data = cherrypy.request.json
        dict_login_session = LoginStageTwo(self.dict_database).main(data['str_password'],
                                                                    cherrypy.request.remote.ip)
        return dict_login_session