/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FavoriteOrder` DROP FOREIGN KEY `FavoriteOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `FollowOrder` DROP FOREIGN KEY `FollowOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_venderId_fkey`;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `category`;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `venderId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `picture` JSON NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `Tag` JSON NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT '',
    `rating` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_venderId_fkey` FOREIGN KEY (`venderId`) REFERENCES `Vender`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowOrder` ADD CONSTRAINT `FollowOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteOrder` ADD CONSTRAINT `FavoriteOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
