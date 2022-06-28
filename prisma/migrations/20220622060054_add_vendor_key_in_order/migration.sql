/*
  Warnings:

  - Added the required column `vendorId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `vendorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
