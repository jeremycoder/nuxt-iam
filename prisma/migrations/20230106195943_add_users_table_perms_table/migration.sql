-- CreateTable
CREATE TABLE `users_table_perms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `can_create_users` VARCHAR(191) NOT NULL,
    `can_view_users` VARCHAR(191) NOT NULL,
    `can_update_users` VARCHAR(191) NOT NULL,
    `can_delete_users` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users_table_perms` ADD CONSTRAINT `users_table_perms_uuid_fkey` FOREIGN KEY (`uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
