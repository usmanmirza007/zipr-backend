/*
  Warnings:

  - You are about to alter the column `picture` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `picture` JSON NOT NULL;
