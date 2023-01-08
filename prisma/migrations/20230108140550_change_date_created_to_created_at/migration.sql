/*
  Warnings:

  - You are about to drop the column `date_created` on the `profile_perms` table. All the data in the column will be lost.
  - You are about to drop the column `date_created` on the `role_perms` table. All the data in the column will be lost.
  - You are about to drop the column `date_created` on the `users_table_perms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile_perms` DROP COLUMN `date_created`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `role_perms` DROP COLUMN `date_created`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users_table_perms` DROP COLUMN `date_created`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
