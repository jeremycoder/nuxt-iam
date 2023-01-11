/*
  Warnings:

  - You are about to drop the `role_perms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `role_perms` DROP FOREIGN KEY `role_perms_user_id_fkey`;

-- DropTable
DROP TABLE `role_perms`;
