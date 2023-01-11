-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
