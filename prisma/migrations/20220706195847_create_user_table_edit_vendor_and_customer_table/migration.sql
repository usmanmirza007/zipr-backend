/*
  Warnings:

  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Vender` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Vender` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Vender` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Vender` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Vender` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `Vender` table. All the data in the column will be lost.
  - You are about to drop the column `venderName` on the `Vender` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Customer_email_key` ON `Customer`;

-- DropIndex
DROP INDEX `Vender_email_key` ON `Vender`;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `password`,
    DROP COLUMN `picture`,
    DROP COLUMN `userType`;

-- AlterTable
ALTER TABLE `Vender` DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `password`,
    DROP COLUMN `picture`,
    DROP COLUMN `userType`,
    DROP COLUMN `venderName`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `userType` ENUM('CUSTOMER', 'VENDER') NOT NULL,
    `venderId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_venderId_fkey` FOREIGN KEY (`venderId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Vender`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
