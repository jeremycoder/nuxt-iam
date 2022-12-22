/*
  Warnings:

  - Added the required column `is_active` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `refresh_tokens` ADD COLUMN `is_active` BOOLEAN NOT NULL;
