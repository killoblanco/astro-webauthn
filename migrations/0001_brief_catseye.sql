CREATE TABLE `auth_credential` (
	`uid` text PRIMARY KEY NOT NULL,
	`credential_id` blob NOT NULL,
	`credential_public_key` blob NOT NULL,
	`counter` integer NOT NULL,
	`credential_device_type` text NOT NULL,
	`credential_backed_up` integer NOT NULL,
	`transports` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_credentials` (
	`auth_uid` text NOT NULL,
	`credential_uid` text NOT NULL,
	PRIMARY KEY(`auth_uid`, `credential_uid`),
	FOREIGN KEY (`auth_uid`) REFERENCES `auth`(`uid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`credential_uid`) REFERENCES `auth_credential`(`uid`) ON UPDATE no action ON DELETE no action
);
