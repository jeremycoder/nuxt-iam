/*
  Warnings:

  - You are about to drop the `used_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `used_tokens`;

-- CreateTable
CREATE TABLE `one_time_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_id` VARCHAR(60) NOT NULL,
    `token_type` ENUM('RESET') NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `token_id`(`token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
