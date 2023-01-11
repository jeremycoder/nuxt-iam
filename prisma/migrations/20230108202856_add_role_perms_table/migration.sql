-- CreateTable
CREATE TABLE `role_perms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `is_super_admin` BOOLEAN NULL DEFAULT false,
    `is_admin` BOOLEAN NULL DEFAULT false,
    `is_general` BOOLEAN NULL DEFAULT false,
    `updated_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
