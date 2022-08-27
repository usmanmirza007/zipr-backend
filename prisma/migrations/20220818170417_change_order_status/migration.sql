/*
  Warnings:

  - The values [DISPATCH,ACCEPT,COMPLETED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'CAPTUREED', 'PROOCESSING', 'DISPATCHED', 'DELIVERED') NOT NULL;
