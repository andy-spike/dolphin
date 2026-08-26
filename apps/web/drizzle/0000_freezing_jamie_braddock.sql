CREATE TABLE `migration_check` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`note` text NOT NULL
);
--> statement-breakpoint
-- Known seed row for ticket 02 (plumbing proof, not product data).
INSERT INTO `migration_check` (`id`, `note`) VALUES (1, 'd1-drizzle-plumbing');
