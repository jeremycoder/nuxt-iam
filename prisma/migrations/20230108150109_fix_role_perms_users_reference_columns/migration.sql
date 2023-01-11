-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_usersId_fkey`;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
