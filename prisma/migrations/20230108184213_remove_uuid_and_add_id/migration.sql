/*
  Warnings:

  - You are about to drop the column `user_uuid` on the `role_perms` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `role_perms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_user_uuid_fkey`;

-- AlterTable
ALTER TABLE `role_perms` DROP COLUMN `user_uuid`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `role_perms` ADD CONSTRAINT `role_perms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
