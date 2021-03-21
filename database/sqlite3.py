#  __author__ = "Michael Pretzel | Pretzel Bytes LLC"
#  __copyright__ = "Copyright 2021"
#  __license__ = "Proprietary"
#  __version__ = 2021.2.3
import sqlite3
import json

class SqLite3:
    connection: sqlite3.Connection = None
    bool_startup: bool = False
    def __init__(self, str_db_file: str, bool_startup: bool = False):
        if self.create_connection(str_db_file):
            if bool_startup:
                print("Initializing sqlite3")
                self.bool_startup = True
                self.create_tables()
                # self.insert_data("INSERT INTO bi_servers(id,serverName,serverUrl) VALUES(?,?,?)",
                #                  ["f4728299-b444-4614-8511-5bb7da96aad7", "HomeServer", "http://10.16.57.190:81"])
                # self.insert_data("INSERT INTO bi_users(id,id_server,userName,password) VALUES(?,?,?,?)",
                #                  ["f4728299-b444-4614-8511-5ff7da96aad7",
                #                   "f4728299-b444-4614-8511-5bb7da96aad7", "michael", "kc8wjb"])
                #r = json.dumps([{"label": "person", "confidence": 50}, {"label": "car", "confidence": 50}])
                t = json.dumps({"int_alert_time": 20, "int_images_to_process": 2, "int_time_between_images": 1,
                                "int_pos_hit_required": 1})
                print(self.update_data("UPDATE bi_cameras SET camera_data = ?", [t,]))
                # print(self.insert_data("INSERT INTO bi_cameras(id,id_server,camera_name,enabled,alert_items,camera_friendly_name, camera_data) VALUES(?,?,?,?,?,?,?)",
                #                  ["5699a239-c296-4393-be86-b93463721c19", "f4728299-b444-4614-8511-5bb7da96aad7", "FrontDoor",
                #                   True, r, "Front Door", t]))
                # print(self.insert_data(
                #     "INSERT INTO bi_cameras(id,id_server,camera_name,enabled,alert_items,camera_friendly_name, camera_data) VALUES(?,?,?,?,?,?,?)",
                #     ["581e25d1-6eb9-4b08-9087-c9852cbd8533", "f4728299-b444-4614-8511-5bb7da96aad7", "DeckDoor",
                #      True, r, "Deck Door", t]))
                # print(self.insert_data(
                #     "INSERT INTO bi_cameras(id,id_server,camera_name,enabled,alert_items,camera_friendly_name, camera_data) VALUES(?,?,?,?,?,?,?)",
                #     ["b228254f-23de-4027-b46b-7a5ce6def382", "f4728299-b444-4614-8511-5bb7da96aad7", "Cam1",
                #      True, r, "Office", t]))
                # self.insert_data("INSERT INTO biServers(id,serverName,serverUrl) VALUES(?,?,?)",
                #                  ["f4728299-b444-4614", "HomeServer", "http://10.16.57.190:81"])
                # self.update_data("UPDATE biServers SET serverName = ? WHERE id = ?", ["MyServer", "f4728299-b444-4614"])
                # self.delete_data("DELETE FROM biServers WHERE id = ?", ["f4728299-b444-4614"])
                # print(self.select_data("SELECT * FROM biServers", []))

    def create_connection(self, str_db_file: str):
        try:
            conn = sqlite3.connect(str_db_file)
            if self.bool_startup:
                print("sqllite3 Version: {}".format(str(sqlite3.version)))
            if conn:
                self.connection = conn
                return True
            else:
                return False
        except Exception as e:
            print("Error Creating or Connecting to sqlite3 Database: {}".format(str(e)))
            return False

    @staticmethod
    def create_table(conn, create_table_sql):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        try:
            cur = conn.cursor()
            cur.execute(create_table_sql)
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def create_tables(self):
        str_table_blue_iris_servers = """ CREATE TABLE IF NOT EXISTS bi_servers (
                                                id text PRIMARY KEY,
                                                serverName text NOT NULL,
                                                serverUrl text NOT NULL
                                            ); """
        str_table_blue_iris_users = """ CREATE TABLE IF NOT EXISTS bi_users (
                                                        id text PRIMARY KEY,
                                                        id_server text NOT NULL,
                                                        userName text NOT NULL,
                                                        password text NOT NULL,
                                                        FOREIGN KEY (id_server) REFERENCES bi_servers (id)
                                                    ); """
        str_table_blue_iris_alerts = """ CREATE TABLE IF NOT EXISTS bi_alerts (
                                                                id text PRIMARY KEY,
                                                                id_camera text NOT NULL,
                                                                processed bool NOT NULL,
                                                                confirmed bool NOT NULL,
                                                                prediction_data text,
                                                                start_timestamp int NOT NULL,
                                                                end_timestamp int,
                                                                FOREIGN KEY (id_camera) REFERENCES bi_cameras (id)
                                                            ); """
        str_table_blue_iris_cameras = """ CREATE TABLE IF NOT EXISTS bi_cameras (
                                                                        id text PRIMARY KEY,
                                                                        id_server text NOT NULL,
                                                                        camera_name text NOT NULL,
                                                                        camera_friendly_name text NOT NULL,
                                                                        camera_data text NOT NULL,
                                                                        enabled bool NOT NULL,
                                                                        alert_items text NOT NULL,
                                                                        FOREIGN KEY (id_server) REFERENCES bi_servers (id)
                                                                    ); """
        result_create_table_servers: dict = self.create_table(self.connection, str_table_blue_iris_servers)
        print("Create BI Servers Table: {}".format(str(result_create_table_servers)))
        result_create_table_users: dict = self.create_table(self.connection, str_table_blue_iris_users)
        print("Create BI Users Table: {}".format(str(result_create_table_users)))
        result_create_table_cameras: dict = self.create_table(self.connection, str_table_blue_iris_cameras)
        print("Create BI Cameras Table: {}".format(str(result_create_table_cameras)))
        result_create_table_alerts: dict = self.create_table(self.connection, str_table_blue_iris_alerts)
        print("Create BI Alerts Table: {}".format(str(result_create_table_alerts)))

    def insert_data(self, str_insert_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        try:
            cur = self.connection.cursor()
            cur.execute(str_insert_statement, arr_values)
            self.connection.commit()
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def update_data(self, str_update_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        try:
            cur = self.connection.cursor()
            cur.execute(str_update_statement, arr_values)
            self.connection.commit()
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def delete_data(self, str_delete_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        try:
            cur = self.connection.cursor()
            cur.execute(str_delete_statement, arr_values)
            self.connection.commit()
            dict_return['int_row_count']: int = cur.rowcount
            dict_return['bool_success']: bool = True
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return

    def select_data(self, str_select_statement: str, arr_values: list):
        dict_return: dict = dict()
        dict_return['bool_error']: bool = False
        dict_return['str_status']: str = ""
        dict_return['int_row_count']: int = 0
        dict_return['bool_success']: bool = False
        dict_return['arr_rows']: list = []
        try:
            cur = self.connection.cursor()
            cur.execute(str_select_statement, arr_values)
            rows = cur.fetchall()
            dict_return['int_row_count']: int = len(rows)
            dict_return['bool_success']: bool = True
            dict_return['arr_rows'] = rows
            cur.close()
        except Exception as e:
            dict_return['bool_error']: bool = True
            dict_return['str_status']: str = str(e)
        return dict_return
