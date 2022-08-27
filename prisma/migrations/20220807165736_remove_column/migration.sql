/*
  Warnings:

  - You are about to drop the column `Tag` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `venderBio` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `venderName` on the `CheckoutOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CheckoutOrder` DROP COLUMN `Tag`,
    DROP COLUMN `description`,
    DROP COLUMN `location`,
    DROP COLUMN `picture`,
    DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    DROP COLUMN `status`,
    DROP COLUMN `venderBio`,
    DROP COLUMN `venderName`;
