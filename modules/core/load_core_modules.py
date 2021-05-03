import cherrypy
import os
import importlib
import json
from global_vars import GlobalVars
import logger


class Root(object):
    pass


class LoadCoreModules(object):
    dict_database: dict

    def __init__(self, str_root_directory, dict_database: dict):
        self.dict_database = dict_database
        my_logger = logger.get_logger('modules.core.load_core_modules')
        my_logger.debug("Loading Core Modules")
        try:
            for entry in os.listdir(os.path.join(str_root_directory, "modules", "core")):
                try:
                    str_module_core_directory = os.path.join(str_root_directory, "modules", "core", entry)
                    str_module_api_directory = os.path.join(str_module_core_directory, "api")
                    str_module_web_directory = os.path.join(str_module_core_directory, "web_interface")
                    # TODO: Implement Services
                    str_module_service_directory = os.path.join(str_module_core_directory, "service")
                    if os.path.isdir(str_module_core_directory):
                        str_module_name = entry
                        if str_module_name.startswith("core_"):
                            my_logger.debug("Loading Core Module: {}".format(str_module_name))
                            if os.path.exists(str_module_api_directory):
                                my_logger.debug("Loading API Components")
                                str_class_name_tmp = str_module_name.split("core_")
                                str_class_name_tmp = str_class_name_tmp[1]
                                arr_class_name = str_class_name_tmp.split("_")
                                str_class_name = ""
                                for name in arr_class_name:
                                    str_class_name = str_class_name + str(name).title()
                                str_folder_file = "modules.core." + str_module_name + ".api." + 'main'
                                class_to_utilize = getattr(importlib.import_module(str_folder_file), str_class_name)
                                instance = class_to_utilize(self.dict_database)
                                str_cherry_py_config_path = os.path.join(str_module_api_directory,
                                                                         'cherry_py_config.json')
                                if os.path.exists(str_cherry_py_config_path):
                                    with open(str_cherry_py_config_path) as file_cherry_py_config:
                                        str_cherry_py_config = json.loads(file_cherry_py_config.read())
                                else:
                                    str_cherry_py_config = {"/":{}}
                                print('/api/' + str_module_name)
                                cherrypy.tree.mount(instance, '/api/' + str_module_name, config=str_cherry_py_config)

                            if os.path.exists(str_module_web_directory):
                                my_logger.debug("Loading Web interface Components")
                                arr_navigation_dict = []
                                str_web_config_path = os.path.join(str_module_web_directory, 'web.config.json')
                                if os.path.exists(str_web_config_path):
                                    with open(str_web_config_path, 'r') as config_reader:
                                        dict_config = json.loads(config_reader.read())
                                        GlobalVars.WebComponents.arr_routes.append(dict_config['routes'])
                                        for nav in dict_config['navigation']:
                                            arr_navigation_dict.append(nav)
                                    GlobalVars.WebComponents.arr_navigation = \
                                        self.merge_dict(arr_navigation_dict, GlobalVars.WebComponents.arr_navigation)
                                str_class_name_tmp = str_module_name.split("core_")
                                str_component = str_class_name_tmp[1].replace("_", "-")
                                str_web_path = "/app/components/core/{}/".format(str_component)
                                print(str_web_path)
                                json_root_config = {'/': {
                                        'tools.staticdir.on': True,
                                        'tools.staticdir.dir': os.path.join(str_module_web_directory, 'static_files'),
                                        'tools.gzip.on': True}}

                                cherrypy.tree.mount(Root(), str_web_path, config=json_root_config)

                except Exception as e:
                    my_logger.error("Error Loading Core Module ({}): {}".format(entry, e))
        except Exception as e:
            my_logger.error("Error Reading Core Modules:  {}".format(e))

    @staticmethod
    def merge_dict(arr_dict, arr_combined):
        for dict_orig in arr_dict:
            bool_exists = False
            for nav_1 in arr_combined:
                if nav_1['name'] == dict_orig['name']:
                    bool_exists = True
            if not bool_exists:
                arr_combined.append(dict_orig)
            else:
                for nav_1 in arr_combined:
                    if nav_1['name'] == dict_orig['name']:
                        if 'children' in nav_1:
                            for child in dict_orig['children']:
                                nav_1['children'].append(child)
        return arr_combined
