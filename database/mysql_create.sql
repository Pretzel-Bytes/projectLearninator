CREATE TABLE `auth_providers` (
	`id_provider` varchar(50) NOT NULL,
	`type` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`enabled` BOOLEAN NOT NULL,
	`provider_data` TEXT NOT NULL,
	PRIMARY KEY (`id_provider`)
);

CREATE TABLE `auth_users` (
	`id_user` varchar(50) NOT NULL,
	`id_provider` varchar(50) NOT NULL,
	`username` varchar(255) NOT NULL UNIQUE,
	`datetime_created` DATETIME NOT NULL,
	`datetime_last_used` DATETIME NOT NULL,
	`datetime_expiration` DATETIME,
	`enabled` BOOLEAN NOT NULL,
	`given_name` varchar(100) NOT NULL,
	`sur_name` varchar(100) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	PRIMARY KEY (`id_user`)
);

CREATE TABLE `rbac_permissions` (
	`id_permission` varchar(50) NOT NULL,
	`permission_name` varchar(255) NOT NULL,
	`datetime_created` DATETIME NOT NULL,
	`datetime_updated` DATETIME NOT NULL,
	`permission_description` TEXT NOT NULL,
	PRIMARY KEY (`id_permission`)
);

CREATE TABLE `rbac_roles` (
	`id_role` varchar(50) NOT NULL,
	`role_name` varchar(255) NOT NULL,
	`datetime_created` DATETIME NOT NULL,
	`datetime_updated` DATETIME NOT NULL,
	`role_description` TEXT NOT NULL,
	`deleted` BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY (`id_role`)
);

CREATE TABLE `rbac_role_permission_assignments` (
	`id_assignment` varchar(50) NOT NULL,
	`id_role` varchar(50) NOT NULL,
	`id_permission` varchar(50) NOT NULL,
	`datetime_created` DATETIME NOT NULL,
	PRIMARY KEY (`id_assignment`)
);

CREATE TABLE `rbac_user_permission_assignments` (
	`id_assignment` varchar(50) NOT NULL,
	`id_user` varchar(50) NOT NULL,
	`id_permission` varchar(50) NOT NULL,
	`datetime_created` DATETIME NOT NULL,
	PRIMARY KEY (`id_assignment`)
);

CREATE TABLE `rbac_user_role_assignments` (
	`id_assignment` varchar(50) NOT NULL,
	`id_user` varchar(50) NOT NULL,
	`id_role` varchar(50) NOT NULL,
	`datetime_created` DATETIME NOT NULL,
	PRIMARY KEY (`id_assignment`)
);

CREATE TABLE `rbac_user_change_log` (
	`id_change` varchar(50) NOT NULL,
	`id_user_effected` varchar(50) NOT NULL,
	`id_user_made_change` varchar(50) NOT NULL,
	`id_permission` varchar(50) NOT NULL,
	`id_role` varchar(50) NOT NULL,
	`datetime_change` DATETIME NOT NULL,
	PRIMARY KEY (`id_change`)
);

CREATE TABLE `rbac_role_change_log` (
	`id_change` varchar(50) NOT NULL,
	`id_role_effected` varchar(50) NOT NULL,
	`id_user_made_change` varchar(50) NOT NULL,
	`id_permission` varchar(50) NOT NULL,
	`datetime_change` DATETIME NOT NULL,
	PRIMARY KEY (`id_change`)
);

CREATE TABLE `auth_sessions` (
	`id_session` varchar(50) NOT NULL,
	`session_id` varchar(100) NOT NULL UNIQUE,
	`id_user` varchar(50) NOT NULL,
	`datetime_created` DATETIME NOT NULL,
	`datetime_lastused` DATETIME NOT NULL,
	`initial_ip` varchar(50) NOT NULL,
	PRIMARY KEY (`id_session`)
);

CREATE TABLE `auth_log` (
	`id_auth` varchar(50) NOT NULL,
	`id_user` varchar(50),
	`datetime` DATETIME NOT NULL,
	`success_1` BOOLEAN NOT NULL,
	`success_2` BOOLEAN NOT NULL,
	`ip_address` varchar(255) NOT NULL,
	PRIMARY KEY (`id_auth`)
);

ALTER TABLE `auth_users` ADD CONSTRAINT `auth_users_fk0` FOREIGN KEY (`id_provider`) REFERENCES `auth_providers`(`id_provider`);

ALTER TABLE `rbac_role_permission_assignments` ADD CONSTRAINT `rbac_role_permission_assignments_fk0` FOREIGN KEY (`id_role`) REFERENCES `rbac_roles`(`id_role`);

ALTER TABLE `rbac_role_permission_assignments` ADD CONSTRAINT `rbac_role_permission_assignments_fk1` FOREIGN KEY (`id_permission`) REFERENCES `rbac_permissions`(`id_permission`);

ALTER TABLE `rbac_user_permission_assignments` ADD CONSTRAINT `rbac_user_permission_assignments_fk0` FOREIGN KEY (`id_user`) REFERENCES `auth_users`(`id_user`);

ALTER TABLE `rbac_user_permission_assignments` ADD CONSTRAINT `rbac_user_permission_assignments_fk1` FOREIGN KEY (`id_permission`) REFERENCES `rbac_permissions`(`id_permission`);

ALTER TABLE `rbac_user_role_assignments` ADD CONSTRAINT `rbac_user_role_assignments_fk0` FOREIGN KEY (`id_user`) REFERENCES `auth_users`(`id_user`);

ALTER TABLE `rbac_user_role_assignments` ADD CONSTRAINT `rbac_user_role_assignments_fk1` FOREIGN KEY (`id_role`) REFERENCES `rbac_roles`(`id_role`);

ALTER TABLE `rbac_user_change_log` ADD CONSTRAINT `rbac_user_change_log_fk0` FOREIGN KEY (`id_user_effected`) REFERENCES `auth_users`(`id_user`);

ALTER TABLE `rbac_user_change_log` ADD CONSTRAINT `rbac_user_change_log_fk1` FOREIGN KEY (`id_user_made_change`) REFERENCES `auth_users`(`id_user`);

ALTER TABLE `rbac_user_change_log` ADD CONSTRAINT `rbac_user_change_log_fk2` FOREIGN KEY (`id_permission`) REFERENCES `rbac_permissions`(`id_permission`);

ALTER TABLE `rbac_user_change_log` ADD CONSTRAINT `rbac_user_change_log_fk3` FOREIGN KEY (`id_role`) REFERENCES `rbac_roles`(`id_role`);

ALTER TABLE `rbac_role_change_log` ADD CONSTRAINT `rbac_role_change_log_fk0` FOREIGN KEY (`id_role_effected`) REFERENCES `rbac_roles`(`id_role`);

ALTER TABLE `rbac_role_change_log` ADD CONSTRAINT `rbac_role_change_log_fk1` FOREIGN KEY (`id_user_made_change`) REFERENCES `auth_users`(`id_user`);

ALTER TABLE `rbac_role_change_log` ADD CONSTRAINT `rbac_role_change_log_fk2` FOREIGN KEY (`id_permission`) REFERENCES `rbac_permissions`(`id_permission`);

ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_fk0` FOREIGN KEY (`id_user`) REFERENCES `auth_users`(`id_user`);

ALTER TABLE `auth_log` ADD CONSTRAINT `auth_log_fk0` FOREIGN KEY (`id_user`) REFERENCES `auth_users`(`id_user`);

