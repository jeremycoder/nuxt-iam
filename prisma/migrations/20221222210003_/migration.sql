/*
  Warnings:

  - You are about to drop the column `is_active` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token_id` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `refresh_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `token_id` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `user_id` ON `refresh_tokens`;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `is_active`,
    DROP COLUMN `token_id`,
    DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_id` ON `users`(`user_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_refresh_token_id_fkey` FOREIGN KEY (`refresh_token_id`) REFERENCES `refresh_tokens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
