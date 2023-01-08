-- CreateTable
CREATE TABLE `profile_perms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `can_view_profile` BOOLEAN NOT NULL DEFAULT true,
    `can_update_profile` BOOLEAN NOT NULL DEFAULT true,
    `can_delete_profile` BOOLEAN NOT NULL DEFAULT true,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile_perms` ADD CONSTRAINT `profile_perms_uuid_fkey` FOREIGN KEY (`uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
