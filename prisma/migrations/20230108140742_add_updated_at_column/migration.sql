/*
  Warnings:

  - Added the required column `updated_at` to the `profile_perms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `role_perms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users_table_perms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile_perms` ADD COLUMN `updated_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `role_perms` ADD COLUMN `updated_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `users_table_perms` ADD COLUMN `updated_at` DATETIME(0) NOT NULL;
