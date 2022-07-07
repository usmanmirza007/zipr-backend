/*
  Warnings:

  - Added the required column `status` to the `CheckoutOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CheckoutOrder` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Vender` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;
