-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_id` VARCHAR(60) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `secret` VARCHAR(255) NOT NULL,
    `expires` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `token_id`(`token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `login_id` VARCHAR(255) NOT NULL,
    `ip_address` VARCHAR(255) NULL,
    `expires` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `login_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `logout_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_attempts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `known` BOOLEAN NOT NULL,
    `login_id` VARCHAR(255) NOT NULL,
    `ip_address` VARCHAR(255) NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
