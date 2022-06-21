-- CreateTable
CREATE TABLE `FollowOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,

    UNIQUE INDEX `FollowOrder_userId_orderId_key`(`userId`, `orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FollowOrder` ADD CONSTRAINT `FollowOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowOrder` ADD CONSTRAINT `FollowOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
