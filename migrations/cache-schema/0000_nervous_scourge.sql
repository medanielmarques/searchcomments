CREATE TABLE `rate_limits` (
	`ip` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`last_access` integer NOT NULL
);
