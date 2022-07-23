/*
  Warnings:

  - You are about to drop the column `Tag` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `FavoriteOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FollowOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tag` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FavoriteOrder` DROP FOREIGN KEY `FavoriteOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `FavoriteOrder` DROP FOREIGN KEY `FavoriteOrder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `FollowOrder` DROP FOREIGN KEY `FollowOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `FollowOrder` DROP FOREIGN KEY `FollowOrder_userId_fkey`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `Tag`,
    ADD COLUMN `tag` JSON NOT NULL;

-- DropTable
DROP TABLE `FavoriteOrder`;

-- DropTable
DROP TABLE `FollowOrder`;

-- CreateTable
CREATE TABLE `FollowProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `FollowProduct_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `FavoriteProduct_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FollowProduct` ADD CONSTRAINT `FollowProduct_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowProduct` ADD CONSTRAINT `FollowProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteProduct` ADD CONSTRAINT `FavoriteProduct_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteProduct` ADD CONSTRAINT `FavoriteProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
