-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_user_uuid_fkey`;

-- AlterTable
ALTER TABLE `role_perms` ADD COLUMN `usersId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
