/*
  Warnings:

  - You are about to alter the column `user_uuid` on the `profile_perms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(60)`.
  - You are about to alter the column `user_uuid` on the `role_perms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(60)`.
  - You are about to alter the column `user_uuid` on the `users_table_perms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(60)`.
  - A unique constraint covering the columns `[user_uuid]` on the table `profile_perms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_uuid]` on the table `role_perms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_uuid]` on the table `users_table_perms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `profile_perms` DROP FOREIGN KEY `profile_perms_user_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_user_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `users_table_perms` DROP FOREIGN KEY `users_table_perms_user_uuid_fkey`;

-- AlterTable
ALTER TABLE `profile_perms` MODIFY `user_uuid` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `role_perms` MODIFY `user_uuid` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `users_table_perms` MODIFY `user_uuid` VARCHAR(60) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_uuid` ON `profile_perms`(`user_uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `user_uuid` ON `role_perms`(`user_uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `user_uuid` ON `users_table_perms`(`user_uuid`);

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_perms` ADD CONSTRAINT `profile_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_table_perms` ADD CONSTRAINT `users_table_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
