-- CreateTable
CREATE TABLE `role_perms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `is_super_admin` BOOLEAN NOT NULL DEFAULT false,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `is_general` BOOLEAN NOT NULL DEFAULT false,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_uuid_fkey` FOREIGN KEY (`uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
