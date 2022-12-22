/*
  Warnings:

  - You are about to alter the column `token_id` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(60)`.
  - A unique constraint covering the columns `[token_id]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `token_id` VARCHAR(60) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `token_id` ON `refresh_tokens`(`token_id`);
