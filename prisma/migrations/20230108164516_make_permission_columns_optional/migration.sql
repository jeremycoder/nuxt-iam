-- AlterTable
ALTER TABLE `profile_perms` MODIFY `can_view_profile` BOOLEAN NULL DEFAULT true,
    MODIFY `can_update_profile` BOOLEAN NULL DEFAULT true,
    MODIFY `can_delete_profile` BOOLEAN NULL DEFAULT true,
    MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `role_perms` MODIFY `is_super_admin` BOOLEAN NULL DEFAULT false,
    MODIFY `is_admin` BOOLEAN NULL DEFAULT false,
    MODIFY `is_general` BOOLEAN NULL DEFAULT false,
    MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `users_table_perms` MODIFY `can_create_users` VARCHAR(191) NULL,
    MODIFY `can_view_users` VARCHAR(191) NULL,
    MODIFY `can_update_users` VARCHAR(191) NULL,
    MODIFY `can_delete_users` VARCHAR(191) NULL,
    MODIFY `updated_at` DATETIME(0) NULL;
