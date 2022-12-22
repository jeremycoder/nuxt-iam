/*
  Warnings:

  - You are about to drop the column `refresh_token_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_refresh_token_id_fkey`;

-- DropIndex
DROP INDEX `user_id` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `refresh_token_id`,
    DROP COLUMN `user_id`;

-- DropTable
DROP TABLE `refresh_tokens`;
