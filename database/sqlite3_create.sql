CREATE TABLE `auth_providers` (
  `id_provider` varchar(50) PRIMARY KEY NOT NULL,
  `type` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `enabled` BOOLEAN NOT NULL,
  `provider_data` TEXT NOT NULL
);

CREATE TABLE `auth_users` (
  `id_user` varchar(50) PRIMARY KEY NOT NULL,
  `id_provider` varchar(50) NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `datetime_last_used` DATETIME NOT NULL,
  `datetime_expiration` DATETIME,
  `enabled` BOOLEAN NOT NULL,
  `given_name` varchar(100) NOT NULL,
  `sur_name` varchar(100) NOT NULL,
  `provider_id` varchar(255) NOT NULL
);

CREATE TABLE `rbac_permissions` (
  `id_permission` varchar(50) PRIMARY KEY NOT NULL,
  `permission_name` varchar(255) NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `datetime_updated` DATETIME NOT NULL,
  `permission_description` TEXT NOT NULL
);

CREATE TABLE `rbac_roles` (
  `id_role` varchar(50) PRIMARY KEY NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `datetime_updated` DATETIME NOT NULL,
  `role_description` TEXT NOT NULL,
  `deleted` BOOLEAN NOT NULL DEFAULT false,
  `id_event_type` varchar(50),
  `id_event` varchar(50)
);

CREATE TABLE `rbac_role_permission_assignments` (
  `id_assignment` varchar(50) PRIMARY KEY NOT NULL,
  `id_role` varchar(50) NOT NULL,
  `id_permission` varchar(50) NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `id_event_type` varchar(50),
  `id_event` varchar(50)
);

CREATE TABLE `rbac_user_permission_assignments` (
  `id_assignment` varchar(50) PRIMARY KEY NOT NULL,
  `id_user` varchar(50) NOT NULL,
  `id_permission` varchar(50) NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `id_event_type` varchar(50),
  `id_event` varchar(50)
);

CREATE TABLE `rbac_user_role_assignments` (
  `id_assignment` varchar(50) PRIMARY KEY NOT NULL,
  `id_user` varchar(50) NOT NULL,
  `id_role` varchar(50) NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `id_event_type` varchar(50),
  `id_event` varchar(50)
);

CREATE TABLE `rbac_user_change_log` (
  `id_change` varchar(50) PRIMARY KEY NOT NULL,
  `id_user_effected` varchar(50) NOT NULL,
  `id_user_made_change` varchar(50) NOT NULL,
  `id_permission` varchar(50) NOT NULL,
  `id_role` varchar(50) NOT NULL,
  `datetime_change` DATETIME NOT NULL
);

CREATE TABLE `rbac_role_change_log` (
  `id_change` varchar(50) PRIMARY KEY NOT NULL,
  `id_role_effected` varchar(50) NOT NULL,
  `id_user_made_change` varchar(50) NOT NULL,
  `id_permission` varchar(50) NOT NULL,
  `datetime_change` DATETIME NOT NULL
);

CREATE TABLE `auth_sessions` (
  `id_session` varchar(50) PRIMARY KEY NOT NULL,
  `session_id` varchar(100) UNIQUE NOT NULL,
  `id_user` varchar(50) NOT NULL,
  `datetime_created` DATETIME NOT NULL,
  `datetime_last_used` DATETIME NOT NULL,
  `initial_ip` varchar(50) NOT NULL,
  `csrf_token` varchar(50) NOT NULL
);

CREATE TABLE `auth_log` (
  `id_auth` varchar(50) PRIMARY KEY NOT NULL,
  `id_user` varchar(50),
  `datetime` DATETIME NOT NULL,
  `success_1` BOOLEAN NOT NULL,
  `success_2` BOOLEAN NOT NULL,
  `ip_address` varchar(255) NOT NULL
);

CREATE TABLE `event_types` (
  `id_event_type` varchar(50) PRIMARY KEY NOT NULL,
  `event_type_name` varchar(50) NOT NULL,
  `event_type_data` TEXT
);

CREATE TABLE `events` (
  `id_event` varchar(50) PRIMARY KEY NOT NULL,
  `id_event_type` varchar(50) NOT NULL,
  `event_name` varchar(50) NOT NULL,
  `event_data` TEXT NOT NULL
);

CREATE TABLE `logon_session` (
  `id_logon_session` varchar(255) PRIMARY KEY NOT NULL,
  `date_time_start` DATETIME NOT NULL,
  `csrf_token` varchar(255) NOT NULL,
  `ip_address` varchar(50) NOT NULL
);