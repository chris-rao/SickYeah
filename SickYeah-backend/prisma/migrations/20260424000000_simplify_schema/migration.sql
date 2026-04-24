-- AlterTable: Restaurant 新增 comment 字段
ALTER TABLE `Restaurant` ADD COLUMN `comment` VARCHAR(191) NULL;

-- CreateTable: RestaurantPhoto
CREATE TABLE `RestaurantPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RestaurantPhoto` ADD CONSTRAINT `RestaurantPhoto_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `ReviewPhoto` DROP FOREIGN KEY `ReviewPhoto_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_userId_fkey`;

-- DropTable
DROP TABLE IF EXISTS `ReviewPhoto`;

-- DropTable
DROP TABLE IF EXISTS `Review`;
