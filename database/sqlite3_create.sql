CREATE TABLE IF NOT EXISTS auth_providers (
	id_provider varchar,
	type varchar,
	name varchar,
	enabled boolean,
	provider_data text
);

CREATE TABLE IF NOT EXISTS auth_users (
	id_user varchar,
	id_provider varchar,
	username varchar,
	datetime_created datetime,
	datetime_last_used datetime,
	datetime_expiration datetime,
	enabled boolean,
	given_name varchar,
	sur_name varchar,
	provider_id varchar
);

CREATE TABLE IF NOT EXISTS rbac_permissions (
	id_permission varchar,
	permission_name varchar,
	datetime_created datetime,
	datetime_updated datetime,
	permission_description text
);

CREATE TABLE IF NOT EXISTS rbac_roles (
	id_role varchar,
	role_name varchar,
	datetime_created datetime,
	datetime_updated datetime,
	role_description text,
	deleted boolean
);

CREATE TABLE IF NOT EXISTS rbac_role_permission_assignments (
	id_assignment varchar,
	id_role varchar,
	id_permission varchar,
	datetime_created datetime
);

CREATE TABLE IF NOT EXISTS rbac_user_permission_assignments (
	id_assignment varchar,
	id_user varchar,
	id_permission varchar,
	datetime_created datetime
);

CREATE TABLE IF NOT EXISTS rbac_user_role_assignments (
	id_assignment varchar,
	id_user varchar,
	id_role varchar,
	datetime_created datetime
);

CREATE TABLE IF NOT EXISTS rbac_user_change_log (
	id_change varchar,
	id_user_effected varchar,
	id_user_made_change varchar,
	id_permission varchar,
	id_role varchar,
	datetime_change datetime
);

CREATE TABLE IF NOT EXISTS rbac_role_change_log (
	id_change varchar,
	id_role_effected varchar,
	id_user_made_change varchar,
	id_permission varchar,
	datetime_change datetime
);

CREATE TABLE IF NOT EXISTS auth_sessions (
	id_session varchar,
	session_id varchar,
	id_user varchar,
	datetime_created datetime,
	datetime_lastused datetime,
	initial_ip varchar
);

CREATE TABLE IF NOT EXISTS auth_log (
	id_auth varchar,
	id_user varchar,
	datetime datetime,
	success_1 boolean,
	success_2 boolean,
	ip_address varchar
);

