/*
  Warnings:

  - You are about to drop the column `password_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `password_verified`,
    ADD COLUMN `email_verified` BOOLEAN NOT NULL DEFAULT false;
