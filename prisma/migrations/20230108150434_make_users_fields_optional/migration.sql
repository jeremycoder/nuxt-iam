/*
  Warnings:

  - You are about to drop the column `usersId` on the `role_perms` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `role_perms_usersId_fkey` ON `role_perms`;

-- AlterTable
ALTER TABLE `role_perms` DROP COLUMN `usersId`;
