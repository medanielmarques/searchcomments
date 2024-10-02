CREATE TABLE `search_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text(36) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
