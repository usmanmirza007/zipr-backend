/*
  Warnings:

  - The values [VENDOR] on the enum `Customer_userType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `vendorId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `venderId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_vendorId_fkey`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `userType` ENUM('CUSTOMER', 'VENDER') NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `vendorId`,
    ADD COLUMN `venderId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Vendor`;

-- CreateTable
CREATE TABLE `Vender` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `venderName` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `userType` ENUM('CUSTOMER', 'VENDER') NOT NULL,

    UNIQUE INDEX `Vender_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_venderId_fkey` FOREIGN KEY (`venderId`) REFERENCES `Vender`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
