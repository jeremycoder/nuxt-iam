/*
  Warnings:

  - You are about to drop the column `uuid` on the `profile_perms` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `role_perms` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `users_table_perms` table. All the data in the column will be lost.
  - Added the required column `user_uuid` to the `profile_perms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `role_perms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `users_table_perms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile_perms` DROP FOREIGN KEY `profile_perms_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `users_table_perms` DROP FOREIGN KEY `users_table_perms_uuid_fkey`;

-- AlterTable
ALTER TABLE `profile_perms` DROP COLUMN `uuid`,
    ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `role_perms` DROP COLUMN `uuid`,
    ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users_table_perms` DROP COLUMN `uuid`,
    ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_perms` ADD CONSTRAINT `profile_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_table_perms` ADD CONSTRAINT `users_table_perms_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
