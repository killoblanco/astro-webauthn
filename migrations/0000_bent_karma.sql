CREATE TABLE `auth` (
	`uid` text PRIMARY KEY NOT NULL,
	`passphrase` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `auth_nonce` (
	`uid` text PRIMARY KEY NOT NULL,
	`nonce` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_passphrase_unique` ON `auth` (`passphrase`);