-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_venderId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_venderId_fkey` FOREIGN KEY (`venderId`) REFERENCES `Vender`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
